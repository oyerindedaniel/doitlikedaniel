import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents, mdxOptions } from "@/components/mdx/mdx-components";
import { ProcessedMdx } from "@/types/mdx";

/**
 * Process MDX content with Next.js MDX Remote
 * This is run on the server side at build time or during ISR
 */
export async function processMdx(content: string): Promise<ProcessedMdx> {
  const { content: processedContent, frontmatter } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      ...mdxOptions,
    },
  });

  return {
    content: processedContent,
    frontmatter,
  };
}
