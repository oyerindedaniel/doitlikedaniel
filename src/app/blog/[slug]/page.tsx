import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { getPostBySlug, getAllPosts } from "@/lib/mdx/mdx-utils";
import { processMdx } from "@/lib/mdx/mdx-server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/mdx/table-of-contents";
import { Button } from "@/components/ui/button";
import { ReadingProgress } from "@/components/mdx/reading-progress";

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
  } catch {
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
      <div className="mx-auto px-4 py-10">
        {/* Back link */}
        <div className="mx-auto max-w-5xl px-4 mb-8">
          <Button variant="link" size="sm" asChild>
            <Link
              href="/blog"
              className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
          </Button>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-12 mx-auto max-w-[90rem]">
          {/* Left spacing - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Main content - centered */}
          <div className="col-span-12 lg:col-span-8 px-4">
            {/* Post header */}
            <header className="mb-10">
              {/* Meta information */}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <time>{meta.date}</time>
                {meta.readingTime && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>
                    <span>{meta.readingTime}</span>
                  </>
                )}
                {meta.author && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>
                    <span>By {meta.author}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-900 dark:text-white sm:text-3xl">
                {meta.title}
              </h1>

              {/* Tags */}
              {meta.tags && meta.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {meta.tags.map((tag: string) => (
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

              {/* Cover image */}
              {meta.coverImage && (
                <div className="relative mb-8 aspect-[3/2] rounded-sm overflow-hidden">
                  <Image
                    src={meta.coverImage}
                    alt={meta.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 720px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5" />
                </div>
              )}
            </header>

            {/* Article content */}
            <article className="prose prose-sm max-w-none text-slate-700 dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-700 prose-a:text-blue-600 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-800 dark:prose-headings:text-slate-50 dark:prose-p:text-slate-300 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300">
              {mdxContent}
            </article>
          </div>

          {/* Table of Contents */}

          <div className="hidden lg:block lg:col-span-2 sticky self-start top-12">
            <TableOfContents />
          </div>

          <ReadingProgress />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
