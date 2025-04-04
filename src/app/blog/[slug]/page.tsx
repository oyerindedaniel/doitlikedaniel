import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { getPostBySlug, getAllPosts } from "@/lib/mdx/mdx-utils";
import { processMdx } from "@/lib/mdx/mdx-server";
import { PostMeta } from "@/types/mdx";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { meta } = await getPostBySlug(slug);

    return {
      title: `${meta.title} | Blog`,
      description: meta.excerpt,
      openGraph: {
        title: meta.title,
        description: meta.excerpt,
        ...(meta.coverImage && { images: [{ url: meta.coverImage }] }),
      },
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist",
    };
  }
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { slug } = await params;
    const { meta, content } = await getPostBySlug(slug);
    const { content: mdxContent } = await processMdx(content);

    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="mr-1 h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to blog
        </Link>

        {/* Post header */}
        <header className="mb-10">
          {/* Meta information */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <time>{meta.date}</time>
            {meta.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{meta.readingTime}</span>
              </>
            )}
            {meta.author && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>By {meta.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-4 font-serif text-2xl font-normal leading-snug text-gray-900 dark:text-white sm:text-3xl">
            {meta.title}
          </h1>

          {/* Tags */}
          {meta.tags && meta.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {meta.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="ghost"
                  size="sm"
                  className="font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Cover image */}
          {meta.coverImage && (
            <div className="relative -mx-6 mb-8 aspect-[3/2] sm:mx-0 sm:rounded-sm">
              <Image
                src={meta.coverImage}
                alt={meta.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 720px"
                className="object-cover sm:rounded-sm"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5 sm:rounded-sm" />
            </div>
          )}
        </header>

        {/* Article content */}
        <article className="prose prose-sm max-w-none text-gray-600 dark:prose-invert prose-headings:font-serif prose-headings:font-normal prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-600 prose-a:text-blue-600 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-blue-800 dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300">
          {mdxContent}
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
