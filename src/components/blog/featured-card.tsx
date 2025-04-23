import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MetaItem } from "@/components/ui/meta-item";
import { PostMeta } from "@/types/mdx";
import { EnhancedImage } from "../ui/enhanced-image";

export interface FeaturedPostProps {
  post: PostMeta;
}

export function FeaturedCard({ post }: FeaturedPostProps) {
  return (
    <div className="mb-12 border-b border-gray-100 pb-12 dark:border-gray-800">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
        <Badge variant="subtle" size="sm">
          Featured
        </Badge>
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image column */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gray-50 md:aspect-auto md:h-full dark:bg-gray-900">
          {post.coverImage ? (
            <EnhancedImage
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <span className="text-sm text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Content column */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
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

          <h2 className="mb-3 text-2xl font-medium tracking-tight leading-tight  text-gray-900 dark:text-white">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-blue-500 dark:hover:text-blue-400"
            >
              {post.title}
            </Link>
          </h2>

          <p className="mb-3 text-sm leading-relaxed line-clamp-3 text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>

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

          <Link
            href={`/blog/${post.slug}`}
            className="mt-4 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read more
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
