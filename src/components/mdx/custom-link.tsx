"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

// Custom Link component that handles both internal and external links
export default function CustomLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link className="my-4 underline" href={href} {...props}>
        {children}
      </Link>
    );
  }

  // External links open in a new tab
  return (
    <a
      className="my-4 underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}
