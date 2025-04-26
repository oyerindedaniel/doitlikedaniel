// "use client";

import CustomLink from "./custom-link";
import CustomImage from "./custom-image";
import CodeBlock from "./code-block";
import { Alert } from "./alert";
import { CalloutBox } from "./callout-box";
import { YoutubeEmbed } from "./youtube-embed";
import {
  MonacoCodeBlock,
  TSCodeBlock,
  PythonCodeBlock,
} from "./monaco-code-block";
import { SmartPre } from "./smart-code-block";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import { shikiConfig } from "@/config/shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { ReactNode } from "react";
import { MDXRemoteProps } from "next-mdx-remote/rsc";
// import Image from "next/image";

interface ComponentProps {
  children?: ReactNode;
  [key: string]: unknown;
}

// MDX components for use with next-mdx-remote
export const mdxComponents = {
  // Override default elements
  a: CustomLink,
  img: CustomImage,
  pre: CodeBlock,

  // Custom components
  Alert,
  CalloutBox,
  YouTube: YoutubeEmbed,
  MonacoCodeBlock,
  TSCodeBlock,
  PythonCodeBlock,
  // SmartPre,

  // Image,
  h1: ({ children, ...props }: ComponentProps) => (
    <h1
      className="text-2xl leading-tight  text-slate-900 dark:text-slate-50"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps) => (
    <h2
      className="mt-6 text-xl leading-tight  text-slate-800 dark:text-slate-100"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps) => (
    <h3
      className="mt-6 text-lg leading-tight  text-slate-800 dark:text-slate-100"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentProps) => (
    <h4
      className="mt-6 text-md leading-tight text-slate-800 dark:text-slate-200"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ComponentProps) => (
    <p
      className="mt-2 mb-4 text-slate-700 text-[0.95rem] md:text-base dark:text-slate-300 leading-relaxed"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentProps) => (
    <ul
      className="mb-4 list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps) => (
    <ol
      className="mb-4 list-decimal pl-6 text-slate-700 dark:text-slate-300 space-y-2"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps) => (
    <li className="text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: ComponentProps) => (
    <blockquote
      className="my-3 border-l-4 border-slate-300 dark:border-slate-700 pl-4 text-slate-700 dark:text-slate-300 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props: ComponentProps) => (
    <hr className="my-3 border-slate-300 dark:border-slate-700" {...props} />
  ),
  table: ({ children, ...props }: ComponentProps) => (
    <div className="mb-6 overflow-x-auto">
      <table
        className="min-w-full divide-y divide-slate-300 dark:divide-slate-700"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentProps) => (
    <thead className="bg-slate-100 dark:bg-slate-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: ComponentProps) => (
    <tbody
      className="divide-y divide-slate-200 dark:divide-slate-800"
      {...props}
    >
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: ComponentProps) => (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: ComponentProps) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentProps) => (
    <td
      className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
      {...props}
    >
      {children}
    </td>
  ),
  strong: ({ children, ...props }: ComponentProps) => (
    <strong
      className="font-semibold text-slate-900 dark:text-slate-100"
      {...props}
    >
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentProps) => (
    <em className="italic text-slate-800 dark:text-slate-200" {...props}>
      {children}
    </em>
  ),
};

// TODO: Use
export const mdxOptions: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [
      // Additional remark plugins added here
      remarkGfm,
    ],
    rehypePlugins: [
      // Additional rehype plugins added here
      rehypeSlug,
      [
        rehypeShiki,
        {
          themes: {
            light: shikiConfig.themes.light,
            dark: shikiConfig.themes.dark,
          },
          inline: "tailing-curly-colon",
          highlightClassName: "highlighted-line",
          langs: shikiConfig.langs,
          langAlias: {
            js: "javascript",
            ts: "typescript",
          },
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationFocus(),
            transformerNotationWordHighlight(),
          ],
        },
      ],
    ],
  },
};

export {
  CustomLink,
  CustomImage,
  CodeBlock,
  Alert,
  CalloutBox,
  YoutubeEmbed,
  MonacoCodeBlock,
  TSCodeBlock,
  PythonCodeBlock,
  SmartPre,
};
