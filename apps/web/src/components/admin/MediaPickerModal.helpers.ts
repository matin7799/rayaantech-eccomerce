import { FileIcon, FilmIcon, FolderIcon, FolderOpenIcon, ImageIcon } from "lucide-react";
export interface FolderNode {
  id: string;
  name: string;
  path: string;
  children?: FolderNode[];
}

export type FileType = "image" | "video" | "document";

export function getFileIcon(type: FileType) {
  switch (type) {
    case "image":
      return ImageIcon;
    case "video":
      return FilmIcon;
    default:
      return FileIcon;
  }
}

export function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

export function getFolderIcon(isActive: boolean) {
  return isActive ? FolderOpenIcon : FolderIcon;
}

/**
 * Extract relative path from S3 CDN URLs
 */
export function parseRelativePath(urlStr: string, bucketName: string = "ranew"): string {
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
 * Helper to add relative path segments to the FolderNode tree map.
 */
function addPathSegmentsToTree(relPath: string, pathMap: Map<string, FolderNode>): void {
  const segments = relPath.split("/").filter(Boolean);
  let currentPath = "";

  for (const seg of segments) {
    const parentPath = currentPath === "" ? "/" : currentPath;
    currentPath = `${currentPath}/${seg}`;

    if (!pathMap.has(currentPath)) {
      const newNode: FolderNode = {
        id: currentPath,
        name: seg,
        path: currentPath,
        children: [],
      };
      pathMap.set(currentPath, newNode);

      const parentNode = pathMap.get(parentPath);
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(newNode);
      }
    }
  }
}

/**
 * Dynamically builds a FolderTree node hierarchy from a list of objects containing CDN URLs.
 */
export function buildFolderTree(objects: Array<{ cdnUrl: string }>): FolderNode[] {
  const root: FolderNode = {
    id: "root",
    name: "ریشه",
    path: "/",
    children: [],
  };

  const pathMap = new Map<string, FolderNode>();
  pathMap.set("/", root);

  for (const obj of objects) {
    const relPath = parseRelativePath(obj.cdnUrl);
    if (relPath !== "/") {
      addPathSegmentsToTree(relPath, pathMap);
    }
  }

  return [root];
}
