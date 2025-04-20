"use client";

import Image, { ImageProps } from "next/image";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getPlaceholderPath, isRemoteImage } from "@/lib/image-utils";
import logger from "@/utils/logger";
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

  const showLoading = !skipPlaceholder;

  const placeholderPath = useMemo(() => {
    if (skipPlaceholder || isRemoteImage(src)) return undefined;

    try {
      console.log("getPlaceholderPath", getPlaceholderPath(src));
      return getPlaceholderPath(src);
    } catch (err) {
      logger.warn(`Error getting placeholder for ${src}:`, err);
      return undefined;
    }
  }, [src, skipPlaceholder]);

  const imageSrc =
    error && fallback ? fallback : isRemoteImage(src) ? src : src;

  const handleError = () => {
    if (fallback) {
      setError(true);
    }
  };

  return (
    <>
      {showLoading && !placeholderPath && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-shimmer rounded-md" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={Number(width) || undefined}
        height={Number(height) || undefined}
        className={cn("", className)}
        placeholder={placeholderPath ? "blur" : "empty"}
        blurDataURL={placeholderPath}
        onError={handleError}
        {...props}
      />
    </>
  );
}
