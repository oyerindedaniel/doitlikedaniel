"use client";

import Image from "next/image";
import { CustomImageProps } from "@/types/mdx";

export default function CustomImage({
  src,
  alt,
  width = 800,
  height = 450,
  sizes = "(max-width: 768px) 100vw, 800px",
  ...props
}: CustomImageProps) {
  if (!src) {
    return null;
  }

  // For external images or non-optimizable ones
  if (src.startsWith("http") || src.startsWith("data:")) {
    return <img src={src} alt={alt || "Blog image"} {...props} />;
  }

  // For local images
  return (
    <span className="inline-block relative my-6 overflow-hidden rounded-sm">
      <Image
        src={src}
        alt={alt || "Blog image"}
        width={width}
        height={height}
        sizes={sizes}
        className="w-full"
        {...props}
      />
    </span>
  );
}
