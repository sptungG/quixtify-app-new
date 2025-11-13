import { ImageProps, Image as MantineImage } from '@mantine/core';
import { ForwardRefRenderFunction, forwardRef, memo, useId } from 'react';

import { cn } from '@/utils/utils';

type TImageProps = Omit<ImageProps, 'alt' | 'src'> & {
  src: string;
  classNameFallback?: string;
  fallback?: React.ReactNode;
  /**
   * Điền tên item để có thể Fallback Ảnh theo tên
   */
  isError?: boolean;
  alt?: string;
};

/**
 * Mantine Image Component
 */
const Image: ForwardRefRenderFunction<HTMLImageElement, TImageProps> = (
  {
    classNameFallback,
    fallback,
    src,
    alt,
    className,
    w = 100,
    h = 100,
    isError,
    ...props
  },
  forwardedRef,
) => {
  const uid = useId();

  return (
    <MantineImage
      ref={forwardedRef as React.Ref<HTMLImageElement>}
      src={isError ? null : src}
      alt={alt || uid}
      className={cn('size-full object-cover', className)}
      w={w}
      h={h}
      fallbackSrc={fallback ? undefined : alt}
      {...props}
    >
      {isError || !src ? (
        <div
          className={cn(
            'flex size-full items-center justify-center uppercase',
            classNameFallback,
          )}
        >
          {fallback || alt}
        </div>
      ) : null}
    </MantineImage>
  );
};

export default memo(forwardRef(Image));
