import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

/**
 * /blog — Editorial blog index with scroll-isolated container.
 *
 * Mobile-first grid: single column on mobile, 2 cols on sm, 3 on lg.
 * RTL direction, Yekan Bakh typography, glassmorphism cards.
 */
function BlogIndexPage() {
  const postsQuery = trpc.blog.list.useQuery(undefined);
  const posts = postsQuery.data ?? [];

  return (
    <ScrollArea className="h-[calc(100dvh-5rem)]">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="mb-6 text-xl font-bold text-text-primary sm:text-2xl">مجله رایان تک</h1>

          {postsQuery.isLoading ? (
            <BlogSkeleton />
          ) : posts.length === 0 ? (
            <p className="text-sm text-text-muted py-12 text-center">هنوز مطلبی منتشر نشده است</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </ScrollArea>
  );
}

/* ─── Blog Card ─── */

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  authorName?: string;
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <Card className="group overflow-hidden border-border bg-surface transition-shadow hover:shadow-glass">
        {/* Cover Image */}
        {post.coverImageUrl ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-surface-secondary" />
        )}

        {/* Content */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-text-primary line-clamp-2 sm:text-base">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 text-xs text-text-muted line-clamp-3">{post.excerpt}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-text-muted">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString("fa-IR")}
              </span>
            )}
            {post.authorName && (
              <span className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {post.authorName}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ─── Skeleton ─── */

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-border">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}
