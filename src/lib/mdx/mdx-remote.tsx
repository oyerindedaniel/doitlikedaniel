"use client";

import { useMemo } from "react";
import { MDXRemote } from "next-mdx-remote";
import { mdxComponents } from "@/components/mdx/mdx-components";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface MdxRemoteProps {
  source: MDXRemoteSerializeResult;
}

export function MdxRemote({ source }: MdxRemoteProps) {
  return useMemo(
    () => (
      <div className="mdx prose max-w-none">
        <MDXRemote {...source} components={mdxComponents} />
      </div>
    ),
    [source]
  );
}
