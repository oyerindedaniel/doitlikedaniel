"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { isRemoteImage } from "@/lib/image-utils";
import { getBlurDataURL } from "@/generated/placeholder-map";
import { IS_DEVELOPMENT } from "@/config/app";

export interface EnhancedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallback?: string;
  skipPlaceholder?: boolean;
}

export function EnhancedImage({
  src,
  alt,
  fallback = "/fallback.jpg",
  width,
  height,
  className,
  skipPlaceholder = IS_DEVELOPMENT,
  ...props
}: EnhancedImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const blurDataURL =
    !skipPlaceholder && !isRemoteImage(src) ? getBlurDataURL(src) : undefined;

  const imageSrc = error && fallback ? fallback : src;

  const handleError = () => {
    if (fallback) {
      setError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && !blurDataURL && !skipPlaceholder && (
        // TODO: review this shimmer not working
        <div className="inset-0 absolute bg-gray-200 dark:bg-gray-800 animate-shimmer rounded-md" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={Number(width) || undefined}
        height={Number(height) || undefined}
        className={cn("", className)}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
