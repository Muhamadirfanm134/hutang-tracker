'use client';

import Image from 'next/image';
import React from 'react';

interface RoundedImageWithCaptionProps {
  src: string;
  alt: string;
  captionType?: string;
  caption: string;
  rounded?: string;
  width?: number;
  height?: number;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  captionWidth?: string;
  aspectRatio?: string; // Tambahan baru
}

const RoundedImageWithCaption: React.FC<RoundedImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  captionType,
  rounded = 'rounded-[16px]',
  width = 800,
  height = 600,
  fontSize = 'text-base',
  textAlign = 'left',
  captionWidth = 'w-auto',
  aspectRatio = 'aspect-square', // Default aspect ratio
}) => {
  const alignmentClass =
    textAlign === 'center'
      ? 'left-1/2 -translate-x-1/2 text-center'
      : textAlign === 'right'
        ? 'right-4 text-right'
        : 'left-4 text-left';

  return (
    <div className={`relative h-auto w-full ${aspectRatio}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full object-cover ${rounded}`}
        priority
      />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[16px] bg-gradient-to-t from-black/60 to-transparent" />

      {/* Caption */}
      <div
        className={`absolute bottom-4 ${alignmentClass} z-10 font-semibold text-white ${fontSize} ${captionWidth}`}
      >
        <div>{captionType && captionType}</div>
        {caption}
      </div>
    </div>
  );
};

export default RoundedImageWithCaption;
