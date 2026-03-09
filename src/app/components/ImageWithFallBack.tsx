"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

// Extend Next.js ImageProps so TS knows about "src", "alt", "className", etc.
type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/fishpie.jpg",
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
