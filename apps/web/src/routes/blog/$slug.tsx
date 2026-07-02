import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRightIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

/**
 * /blog/$slug — Full blog post view with scroll-isolated container.
 *
 * Uses @tailwindcss/typography prose classes for rich content rendering.
 * Scroll isolation via ScrollArea component.
 */
function BlogPostPage() {
  const { slug } = Route.useParams();
  const postQuery = trpc.blog.getBySlug.useQuery({ slug });
  const post = postQuery.data;

  if (postQuery.isLoading) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-text-primary">مطلب یافت نشد</p>
          <Link to="/blog" className="mt-4 block">
            <Button variant="outline" size="sm">
              بازگشت به مجله
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100dvh-5rem)]">
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
      >
        {/* Back Link */}
        <Link
          to="/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
        >
          <ArrowRightIcon className="h-3.5 w-3.5" />
          بازگشت به مجله
        </Link>

        {/* Cover */}
        {post.coverImageUrl && (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full object-cover aspect-[2/1]"
            />
          </div>
        )}

        {/* Header */}
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl leading-relaxed">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("fa-IR")}
            </span>
          )}
          {post.authorName && (
            <span className="flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" />
              {post.authorName}
            </span>
          )}
        </div>

        {/* Content — rendered as HTML via prose */}
        <div
          className="prose prose-sm mt-8 max-w-none text-text-secondary prose-headings:text-text-primary prose-a:text-accent prose-strong:text-text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
    </ScrollArea>
  );
}

/* ─── Skeleton ─── */

function PostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="aspect-[2/1] w-full rounded-xl" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
