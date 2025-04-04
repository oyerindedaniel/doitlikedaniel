import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { format } from "date-fns";
import { PostMeta, PostWithContent } from "@/types/mdx";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// Get all posts
export const getAllPosts = (): PostMeta[] => {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"));

  // Parse each file and extract metadata
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(BLOG_DIR, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const date = data.date ? format(new Date(data.date), "MMMM dd, yyyy") : "";

    return {
      title: data.title || "Untitled Post",
      date,
      excerpt: data.excerpt || "",
      slug,
      tags: data.tags || [],
      author: data.author || "Anonymous",
      coverImage: data.coverImage || "",
      readingTime: data.readingTime || "",
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get a single post by slug
export const getPostBySlug = (slug: string): PostWithContent => {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const date = data.date ? format(new Date(data.date), "MMMM dd, yyyy") : "";

  return {
    meta: {
      title: data.title || "Untitled Post",
      date,
      excerpt: data.excerpt || "",
      slug,
      tags: data.tags || [],
      author: data.author || "Anonymous",
      coverImage: data.coverImage || "",
      readingTime: data.readingTime || "",
    },
    content,
  };
};
