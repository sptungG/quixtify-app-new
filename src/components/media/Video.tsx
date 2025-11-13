import { ForwardRefRenderFunction, forwardRef, useId, useState } from 'react';

import { NOT_FOUND_VIDEO } from '@/utils/constants';
import { cn } from '@/utils/utils';

type TImageProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  classNameWrapper?: string;
  classNameFallback?: string;
  fallback?: string;
  type?: string;
};

/**
 * Normal Video
 */
const Video: ForwardRefRenderFunction<HTMLVideoElement, TImageProps> = (
  {
    src,
    classNameFallback,
    fallback = NOT_FOUND_VIDEO,
    className,
    poster,
    type = 'video/mp4',
    ...props
  },
  forwardedRef,
) => {
  const uid = useId();
  const [internalSrc, setInternalSrc] = useState<string | undefined>(src);

  return (
    <video
      poster={poster}
      onError={() => {
        setInternalSrc(fallback);
      }}
      ref={forwardedRef}
      className={cn(
        className,
        !src || internalSrc !== src ? classNameFallback : '',
      )}
      muted
      preload="metadata"
      disablePictureInPicture
      controlsList="nofullscreen nodownload noremoteplayback noplaybackrate foobar"
      {...props}
    >
      <source src={internalSrc} type={type} />
    </video>
  );
};

export default forwardRef(Video);
