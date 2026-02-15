'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { SwipeIcon } from '@/components/ui/Icon';
import { usePathname, useSearchParams } from 'next/navigation';

interface DragableSliderProps {
  beforeImage: string;
  afterImage: string;
}

const DragableSlider: React.FC<DragableSliderProps> = ({
  beforeImage,
  afterImage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);
  const isDragging = useRef(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSliderX(50);
  }, [pathname, searchParams.toString()]);

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX =
      'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.max(0, Math.min(100, pos)));
  };

  const startDrag = () => {
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
  };

  const stopDrag = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchend', stopDrag);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square h-full w-full touch-none overflow-hidden rounded-2xl select-none max-lg:mb-[24px]"
    >
      {/* After image */}
      <Image
        src={afterImage}
        alt="After"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Before image */}
      <Image
        src={beforeImage}
        alt="Before"
        fill
        className="absolute top-0 left-0 object-cover"
        sizes="100vw"
        priority
        style={{
          clipPath: `inset(0 ${100 - sliderX}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderX}% 0 0)`,
        }}
      />

      {/* Handle */}
      <div
        className="absolute top-0 z-20 h-full w-1 cursor-ew-resize bg-orange-500"
        style={{ left: `${sliderX}%`, transform: 'translateX(-50%)' }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className="absolute top-1/2 left-1/2 z-30 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-500 bg-white shadow-md">
          <SwipeIcon className="text-(--color-primary-500)" />
        </div>
      </div>
    </div>
  );
};

export default DragableSlider;
