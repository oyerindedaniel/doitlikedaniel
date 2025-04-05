"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleHeadingsRef = useRef(new Map<string, boolean>());

  // Extract headings from the content
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

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

    // Initialize the visibility map
    const visibleMap = new Map<string, boolean>();
    items.forEach((item) => {
      visibleMap.set(item.id, false);
    });
    visibleHeadingsRef.current = visibleMap;
  }, []);

  // Determine active headings based on visibility
  const updateActiveHeadings = useCallback(() => {
    if (headings.length === 0) return;

    const currentlyVisible = headings
      .filter((heading) => visibleHeadingsRef.current.get(heading.id))
      .map((heading) => heading.id);

    if (currentlyVisible.length > 0) {
      setActiveIds(currentlyVisible);
    } else {
      setActiveIds([]);
    }
  }, [headings]);

  // Set up IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    // IntersectionObserver callback
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      let hasChanges = false;

      entries.forEach((entry) => {
        const currentState = visibleHeadingsRef.current.get(entry.target.id);
        if (entry.isIntersecting !== currentState) {
          visibleHeadingsRef.current.set(entry.target.id, entry.isIntersecting);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        updateActiveHeadings();
      }
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "0px",
      threshold: 0.5,
    });

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
  }, [headings, updateActiveHeadings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav>
      <div>
        <h4 className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          Table of Contents
        </h4>
        <ul className="text-xs">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`border-l-2 ${
                activeIds.includes(heading.id)
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
                  setActiveIds([heading.id]);
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
