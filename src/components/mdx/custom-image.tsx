"use client";

import { EnhancedImage } from "../ui/enhanced-image";
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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || "Blog image"} {...props} />;
  }

  // For local images
  return (
    <span className="inline-block relative my-3 overflow-hidden rounded-sm">
      <EnhancedImage
        src={src}
        alt={alt || "Blog image"}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "auto",
        }}
        sizes={sizes}
        className="w-full"
        {...props}
      />
    </span>
  );
}
