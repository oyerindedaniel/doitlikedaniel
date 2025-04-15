import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { format, isValid } from "date-fns";
import { PostMeta, PostWithContent } from "@/types/mdx";
import {
  isNotFoundError,
  isSystemError,
  NotFoundError,
  SystemError,
} from "@/utils/errors";
import logger from "@/utils/logger";
import { normalizeAppError } from "@/utils/errors";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// Get all posts
export const getAllPosts = (): PostMeta[] => {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      logger.warn(`Blog directory not found: ${BLOG_DIR}`);
      return [];
    }

    const files = fs
      .readdirSync(BLOG_DIR)
      .filter((file) => file.endsWith(".mdx"));

    // Parse each file and extract metadata
    const posts = files
      .map((file) => {
        try {
          const slug = file.replace(/\.mdx$/, "");
          const fullPath = path.join(BLOG_DIR, file);
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data } = matter(fileContents);

          const date = data.date
            ? isValid(new Date(data.date))
              ? format(new Date(data.date), "MMMM dd, yyyy")
              : ""
            : "";

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
        } catch (error) {
          throw error;
        }
      })
      .filter(Boolean) as PostMeta[];

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    throw new SystemError("Failed to get all posts", {
      data: {
        originalError: normalizeAppError(error),
      },
    });
  }
};

// Get a single post by slug
export const getPostBySlug = (slug: string): PostWithContent => {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundError(`Post with slug '${slug}' not found`, {
        data: {
          resource: "Post",
          id: slug,
        },
      });
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    if (!data.title) {
      throw new SystemError(`Invalid post data for '${slug}': missing title`, {
        data: {
          context: {
            metadata: {
              slug,
              path: fullPath,
            },
          },
        },
      });
    }

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
  } catch (error) {
    if (isNotFoundError(error) || isSystemError(error)) {
      throw error;
    }

    throw new SystemError(`Error getting post '${slug}'`, {
      data: {
        originalError: normalizeAppError(error),
        context: { metadata: { slug } },
      },
    });
  }
};
