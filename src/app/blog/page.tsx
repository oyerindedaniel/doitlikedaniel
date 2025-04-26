import { getAllPosts } from "@/lib/mdx/mdx-utils";
import { Metadata } from "next";
import BlogPost from "@/components/blog/blog-card";
import BlogHeader from "@/components/blog/blog-header";
import { FeaturedCard } from "@/components/blog/featured-card";
import { isSystemError, normalizeAppError, SystemError } from "@/utils/errors";
import { logServerError } from "@/lib/telemetry/posthog.server";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read my latest thoughts, tutorials, and insights on web development, design, and technology",
};

export default function BlogPage() {
  try {
    const posts = getAllPosts();
    const featuredPost = posts.length > 0 ? posts[0] : null;
    const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

    return (
      <>
        <BlogHeader />

        <div className="container mx-auto px-6 pb-16">
          {featuredPost && <FeaturedCard post={featuredPost} />}

          <div>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              All Posts
            </h2>

            {posts.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {remainingPosts.map((post) => (
                  <BlogPost key={post.slug} post={post} />
                ))}
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
  } catch (error) {
    const normalizedError =
      error instanceof Error
        ? isSystemError(error)
          ? error
          : new SystemError("Error loading blog posts", {
              data: { originalError: error },
            })
        : new SystemError("Unknown error loading blog posts", {
            data: { originalError: normalizeAppError(error) },
          });

    logServerError(normalizedError);

    return (
      <>
        <BlogHeader />
        <div className="container mx-auto px-6 pb-16">
          <div className="rounded-sm border border-gray-100 bg-white/50 p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/30">
            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
              Error loading posts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              There was a problem loading the blog posts. Please try again
              later.
            </p>
          </div>
        </div>
      </>
    );
  }
}
