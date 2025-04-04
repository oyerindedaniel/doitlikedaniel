"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from the content
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    // Get all h1, h2, h3 elements
    const elements = article.querySelectorAll("h1, h2, h3");
    const items: TocItem[] = [];

    elements.forEach((element) => {
      const id = element.id;
      const text = element.textContent || "";
      const level = parseInt(element.tagName.substring(1), 10);

      if (id && text) {
        items.push({ id, text, level });
      } else if (text) {
        const generatedId = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        element.id = generatedId;
        items.push({ id: generatedId, text, level });
      }
    });

    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      rootMargin: "0px 0px -80% 0px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver(callback, options);

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  console.log(headings);

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto pb-8">
        <h4 className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          Table of Contents
        </h4>
        <ul className="text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`border-l-2 ${
                activeId === heading.id
                  ? "border-blue-500 font-medium text-blue-600 dark:text-blue-400"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
              }`}
              style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
            >
              <Link
                href={`#${heading.id}`}
                className="block py-1 pl-3"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
