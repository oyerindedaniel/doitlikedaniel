import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents, mdxOptions } from "@/components/mdx/mdx-components";
import { ProcessedMdx } from "@/types/mdx";

export async function processMdx(content: string): Promise<ProcessedMdx> {
  const { content: processedContent, frontmatter } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: mdxOptions.remarkPlugins,
        rehypePlugins: mdxOptions.rehypePlugins,
      },
    },
  });

  return {
    content: processedContent,
    frontmatter,
  };
}
