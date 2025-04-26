"use client";

import { EnhancedImage } from "../ui/enhanced-image";
import { CustomImageProps } from "@/types/mdx";
import { isRemoteImage } from "@/lib/image-utils";

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
  if (isRemoteImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="my-3" src={src} alt={alt || "Blog image"} {...props} />
    );
  }

  // For local images
  return (
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
      className="w-full rounded-sm my-3"
      {...props}
    />
  );
}
