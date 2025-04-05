import { ImgHTMLAttributes, ReactNode } from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { ImageProps } from "next/image";

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
  author?: string;
  coverImage?: string;
  readingTime?: string;
}

export type CustomImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height" | "loading" | "sizes"
> &
  Partial<
    Pick<ImageProps, "width" | "height" | "sizes" | "priority" | "quality">
  >;

export interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
  [key: string]: unknown;
}

export interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export interface ProcessedMdx {
  content: ReactNode;
  frontmatter: Record<string, unknown>;
}

export interface PostWithContent {
  meta: PostMeta;
  content: string;
}
