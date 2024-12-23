'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string;
  size: number;
  fallbackText: string;
}

export const ProfileImage = ({ src, size, fallbackText }: ProfileImageProps) => {
  const [error, setError] = useState(false);
  const sizeInPx = size * 4;

  const containerStyle = {
    width: `${sizeInPx}px`,
    height: `${sizeInPx}px`,
    position: 'relative' as const,
  };

  if (error) {
    return (
      <div 
        style={containerStyle} 
        className="rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Image
        src={src}
        alt=""
        width={sizeInPx}
        height={sizeInPx}
        className="rounded-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}; 