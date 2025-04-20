"use client";

import Link from "next/link";
import { EnhancedImage } from "@/components/ui/enhanced-image";
import { PostMeta } from "@/types/mdx";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface BlogPostExampleProps {
  post: PostMeta;
  variant?: "default" | "compact";
  className?: string;
}

export function BlogPostExample({
  post,
  variant = "default",
  className,
}: BlogPostExampleProps) {
  const { title, date, excerpt, slug, coverImage, tags } = post;

  return (
    <div
      className={cn(
        "group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:shadow-md",
        variant === "compact" ? "max-w-sm" : "w-full",
        className
      )}
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <EnhancedImage
            src={coverImage || "/images/blog/placeholder.jpg"}
            fallback="/images/blog/placeholder.jpg"
            alt={title}
            width={800}
            height={450}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>

          {date && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {date}
            </p>
          )}

          {excerpt && variant !== "compact" && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {excerpt}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, variant === "compact" ? 2 : 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="primary"
                  size="sm"
                  className="font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > (variant === "compact" ? 2 : 3) && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  +{tags.length - (variant === "compact" ? 2 : 3)}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
