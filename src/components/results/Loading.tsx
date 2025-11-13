import React from 'react';

import { cn } from '@/utils/utils';

import { LogoText01Svg } from '../icons/LogoTextSvg';

type TLoadingProps = { className?: string; classNameImage?: number };
export const LoadingScreen = ({ className, classNameImage }: TLoadingProps) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm',
        className,
      )}
    >
      <LogoText01Svg className="mb-2 h-10 w-auto animate-[bounceY_1s_infinite] text-gray-900" />
    </div>
  );
};
