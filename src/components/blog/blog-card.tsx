import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/types/mdx";
import { Badge } from "@/components/ui/badge";
import { MetaItem } from "../ui/meta-item";

interface BlogPostProps {
  post: PostMeta;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="group relative border-t border-gray-100 py-6 transition-colors dark:border-gray-800">
      <div className="grid grid-cols-12 gap-4">
        {/* Image */}
        {post.coverImage ? (
          <div className="col-span-12 sm:col-span-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 220px"
                className="object-cover opacity-90 transition-all duration-300 group-hover:opacity-100"
              />
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-500/70 to-purple-500/70" />
        )}

        {/* Content */}
        <div
          className={`col-span-12 flex flex-col justify-center ${
            post.coverImage ? "sm:col-span-9" : ""
          }`}
        >
          {/* Metadata */}
          <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {/* Date with icon */}
            <MetaItem
              icon={
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              }
            >
              <time>{post.date}</time>
            </MetaItem>

            {post.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                {/* Reading time with icon */}
                <MetaItem
                  icon={
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  }
                >
                  {post.readingTime}
                </MetaItem>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-medium tracking-tight text-gray-900 dark:text-white">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="mb-2 text-sm leading-relaxed line-clamp-3 text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="primary"
                  size="sm"
                  className="font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
