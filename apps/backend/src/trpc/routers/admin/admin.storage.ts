import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const listStorageObjectsSchema = z.object({
  path: z.string(),
});

const deleteStorageObjectSchema = z.object({
  objectId: z.string().uuid(),
});

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extract relative path from S3 CDN URLs
 */
function parseRelativePath(urlStr: string, bucketName: string = "ranew"): string {
  try {
    const url = new URL(urlStr);
    let pathname = decodeURIComponent(url.pathname);

    // Strip leading bucket name if path-style access
    const bucketPrefix = `/${bucketName}/`;
    if (pathname.startsWith(bucketPrefix)) {
      pathname = pathname.substring(bucketPrefix.length - 1);
    }

    const lastSlashIdx = pathname.lastIndexOf("/");
    if (lastSlashIdx <= 0) {
      return "/";
    }
    return pathname.substring(0, lastSlashIdx);
  } catch {
    return "/";
  }
}

/**
 * Admin storage operations router.
 */
export function createAdminStorageRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all storage objects (media records) in the database.
     */
    listStorageObjects: adminProcedure.input(listStorageObjectsSchema).query(async () => {
      const result = await db.execute<
        {
          id: string;
          url: string;
          webp_url: string | null;
          mime_type: string;
          file_size: number;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, url, webp_url, mime_type, file_size, created_at
              FROM media
              ORDER BY created_at DESC`,
      );

      const objects = result.rows.map((row) => {
        const url = row.webp_url || row.url;
        const name = url.substring(url.lastIndexOf("/") + 1);
        let type: "image" | "video" | "document" | "folder" = "document";
        if (row.mime_type.startsWith("image/")) {
          type = "image";
        } else if (row.mime_type.startsWith("video/")) {
          type = "video";
        }

        const thumbnailUrl = type === "image" ? url : null;

        return {
          id: row.id,
          name,
          type,
          size: formatBytes(row.file_size),
          mimeType: row.mime_type,
          cdnUrl: url,
          thumbnailUrl,
          updatedAt: new Date(row.created_at).toISOString(),
        };
      });

      return { objects };
    }),

    /**
     * Delete a storage object by ID.
     */
    deleteStorageObject: adminProcedure
      .input(deleteStorageObjectSchema)
      .mutation(async ({ input }) => {
        const { objectId } = input;

        // 1. Fetch the media record from the database
        const result = await db.execute<
          {
            id: string;
            url: string;
            webp_url: string | null;
            mime_type: string;
            file_size: number;
            storage_provider: string;
          } & Record<string, unknown>
        >(
          sql`SELECT id, url, webp_url, mime_type, file_size, storage_provider
              FROM media
              WHERE id = ${objectId}
              LIMIT 1`,
        );

        const row = result.rows[0];
        if (!row) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "فایل یافت نشد",
          });
        }

        // 2. Delete the record from the database
        await db.execute(sql`DELETE FROM media WHERE id = ${objectId}`);

        // 3. Delete physical files from S3 or local storage
        if (row.storage_provider === "local") {
          const filename = row.url.substring(row.url.lastIndexOf("/") + 1);
          const uploadDir = process.env.UPLOAD_DIR || "./uploads";
          const filePath = join(uploadDir, filename);

          try {
            await unlink(filePath);
          } catch (err) {
            // Ignore error if file was already deleted/not found
          }

          if (row.webp_url) {
            const webpFilename = row.webp_url.substring(row.webp_url.lastIndexOf("/") + 1);
            const webpFilePath = join(uploadDir, webpFilename);
            try {
              await unlink(webpFilePath);
            } catch (err) {
              // Ignore error
            }
          }
        } else if (row.storage_provider === "s3") {
          const s3Bucket = process.env.S3_BUCKET;
          if (s3Bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
            const region = process.env.S3_REGION || "us-east-1";
            const endpoint = process.env.S3_ENDPOINT || undefined;
            const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

            const client = new S3Client({
              region,
              endpoint,
              forcePathStyle,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              },
            });

            const filename = row.url.substring(row.url.lastIndexOf("/") + 1);
            const command = new DeleteObjectCommand({
              Bucket: s3Bucket,
              Key: `media/${filename}`,
            });

            try {
              await client.send(command);
            } catch (err) {
              // Ignore error
            }

            if (row.webp_url) {
              const webpFilename = row.webp_url.substring(row.webp_url.lastIndexOf("/") + 1);
              const commandWebp = new DeleteObjectCommand({
                Bucket: s3Bucket,
                Key: `media/${webpFilename}`,
              });
              try {
                await client.send(commandWebp);
              } catch (err) {
                // Ignore error
              }
            }
          }
        }

        return { success: true };
      }),

    /**
     * Get dynamic hierarchical folder tree structure with file counts.
     */
    getStorageFolders: adminProcedure.query(async () => {
      const result = await db.execute<{ url: string; webp_url: string | null }>(
        sql`SELECT url, webp_url FROM media`,
      );

      // Count files per relative path
      const pathCounts = new Map<string, number>();
      for (const row of result.rows) {
        const urlStr = row.webp_url || row.url;
        if (!urlStr) continue;

        let relPath = parseRelativePath(urlStr);
        relPath = relPath.replace(/^\/|\/$/g, "");
        if (relPath === "") {
          relPath = "root";
        }

        pathCounts.set(relPath, (pathCounts.get(relPath) || 0) + 1);
      }

      // Build tree
      const pathMap = new Map<string, any>();
      const rootFolders: any[] = [];

      function addPathToTree(fullPath: string) {
        if (fullPath === "root" || fullPath === "") return;
        const segments = fullPath.split("/");
        let currentPath = "";

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          const parentPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${seg}` : seg;

          if (!pathMap.has(currentPath)) {
            let displayName = seg;
            if (currentPath === "products-media") displayName = "محصولات و واریانتها";
            else if (currentPath === "products-media/box-inspection") displayName = "بازرسی جعبه‌ها";
            else if (currentPath === "products-media/thumbnails") displayName = "تصاویر بندانگشتی";
            else if (currentPath === "shoppable-stories") displayName = "استوریهای ویدیویی";
            else if (currentPath === "shoppable-stories/active") displayName = "فعال";
            else if (currentPath === "shoppable-stories/archive") displayName = "آرشیو";
            else if (currentPath === "marketing-banners") displayName = "بنرهای تبلیغاتی";
            else if (currentPath === "marketing-banners/homepage") displayName = "صفحه اصلی";
            else if (currentPath === "marketing-banners/campaigns") displayName = "کمپین‌ها";
            else if (currentPath === "blog-assets") displayName = "مقالات بلاگ";

            const newNode = {
              id: currentPath,
              name: displayName,
              slug: currentPath,
              filesCount: pathCounts.get(currentPath) || 0,
              children: [] as any[],
            };
            pathMap.set(currentPath, newNode);

            if (parentPath) {
              const parentNode = pathMap.get(parentPath);
              if (parentNode) {
                parentNode.children.push(newNode);
              }
            } else {
              rootFolders.push(newNode);
            }
          }
        }
      }

      for (const path of pathCounts.keys()) {
        addPathToTree(path);
      }

      const sanitizeTree = (nodes: any[]): any[] => {
        return nodes.map((node) => {
          const sanitized: any = {
            id: node.id,
            name: node.name,
            slug: node.slug,
            filesCount: node.filesCount,
          };
          if (node.children && node.children.length > 0) {
            sanitized.children = sanitizeTree(node.children);
          }
          return sanitized;
        });
      };

      const folders = sanitizeTree(rootFolders);
      return { folders };
    }),
  });
}
