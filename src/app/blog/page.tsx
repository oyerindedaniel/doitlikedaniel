import { getAllPosts } from "@/lib/mdx/mdx-utils";
import { Metadata } from "next";
import BlogPost from "@/components/blog/blog-card";
import BlogHeader from "@/components/blog/blog-header";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Daniel's Personal Site",
  description:
    "Read my latest thoughts, tutorials, and insights on web development, design, and technology",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <>
      <BlogHeader />

      <div className="container mx-auto px-6 pb-16">
        {featuredPost && (
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
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
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
                  <time>{featuredPost.date}</time>
                  {featuredPost.readingTime && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <span>{featuredPost.readingTime}</span>
                    </>
                  )}
                </div>

                <h2 className="mb-3 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {featuredPost.excerpt}
                </p>

                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {featuredPost.tags.map((tag: string) => (
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
                  href={`/blog/${featuredPost.slug}`}
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
        )}

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            All Posts
          </h2>

          {posts.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {remainingPosts.map((post) => (
                <BlogPost key={post.slug} post={post} />
              ))}
              {remainingPosts.length > 0 && featuredPost && (
                <BlogPost key={featuredPost.slug} post={featuredPost} />
              )}
              {remainingPosts.length === 0 && featuredPost && (
                <BlogPost key={featuredPost.slug} post={featuredPost} />
              )}
            </div>
          ) : (
            <div className="rounded-sm border border-gray-100 bg-white/50 p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/30">
              <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                No posts found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check back soon for new content.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
