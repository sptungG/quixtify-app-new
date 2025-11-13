import { Carousel } from '@mantine/carousel';
import { Avatar, Rating, Text } from '@mantine/core';
import { useId } from '@mantine/hooks';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

import { LogoText01Svg } from '@/components/icons/LogoTextSvg';
import useTranslation from '@/hooks/useTranslation';
import { IMAGE_PATHNAME } from '@/utils/constants';

type TFormWrapperProps = {
  children?: React.ReactNode;
  classNameRight?: string;
};

const cldVideo = (publicId: string, version: string) =>
  `${IMAGE_PATHNAME}/video/upload/q_auto:eco,f_auto/${version}/${publicId}`;
const cldPoster = (publicId: string, version: string) =>
  `${IMAGE_PATHNAME}/video/upload/so_1,du_1,pg_1,q_auto:good,f_jpg/${version}/${publicId}.jpg`;

const slides = [
  {
    id: 'signup_video_1_gotugk',
    v: 'v1752294429',
    title: 'No credit card required',
    desc: 'Get started with Quixtify! No credit card required. Trusted by 1,000+ business owners and professionals.',
  },
  {
    id: 'signup_video_4_fznd5x',
    v: 'v1752294426',
    title: 'Create your own booking calendar',
    desc: 'Easily schedule appointments, manage your calendar with our free online booking software.',
  },
  {
    id: 'signup_video_2_vybyzh',
    v: 'v1752294425',
    title: '24/7 Real People, Real Support',
    desc: 'Talk to real experts anytime, day or night.',
  },
];

// ==================== CAROUSEL SLIDE COMPONENT ====================
type TCarouselSlideItemProps = {
  item: (typeof slides)[0];
  t: (key: string) => string;
};

const CarouselSlideItem = ({ item, t }: TCarouselSlideItemProps) => {
  return (
    <Carousel.Slide pos="relative" w="auto" p={0}>
      {/* Video Background */}
      <video
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={`${cldVideo(item.id, item.v)}.mp4`}
          type='video/mp4; codecs="hvc1"'
        />
        <source src={`${cldVideo(item.id, item.v)}.mp4`} type="video/mp4" />
        <source src={`${cldVideo(item.id, item.v)}.webm`} type="video/webm" />
      </video>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 z-10 px-10 pb-40">
        <Text className="mb-6 font-sora text-4xl font-medium leading-[1.2] text-gray-50">
          {item.title}
        </Text>
        <Text className="text-lg text-gray-100">{t(item.desc)}</Text>
      </div>
    </Carousel.Slide>
  );
};

// ==================== LEFT SIDEBAR COMPONENT ====================

type TSignUpSliderProps = {};

const SignUpSlider = ({}: TSignUpSliderProps) => {
  const uid = useId();
  const { t } = useTranslation();
  const autoplay = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false, stopOnFocusIn: false }),
  );

  const avatars = [
    { image: 'https://i.pravatar.cc/150?img=44', alt: 'A' },
    { image: 'https://i.pravatar.cc/150?img=41', alt: 'B' },
    { image: 'https://i.pravatar.cc/150?img=12', alt: 'C' },
    { image: 'https://i.pravatar.cc/150?img=13', alt: 'D' },
    { image: 'https://i.pravatar.cc/150?img=29', alt: 'E' },
  ];

  return (
    <div className="relative hidden min-w-0 max-w-[91.77dvh] flex-[1_1_auto] p-0 lg:block">
      {/* Logo */}
      <div className="absolute left-0 top-0 z-1 pl-10 pt-10">
        <LogoText01Svg className="h-10 w-auto text-white" />
      </div>

      {/* Carousel */}
      <Carousel
        plugins={[autoplay.current]}
        height="100%"
        withControls={false}
        withIndicators
        styles={{
          root: { height: '100%', width: 'auto' },
          viewport: { height: '100%' },
          container: { height: '100%' },
          indicators: {
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            gap: 8,
          },
        }}
        emblaOptions={{
          loop: true,
        }}
      >
        {slides.map(item => (
          <CarouselSlideItem key={uid + item.id} item={item} t={t} />
        ))}
      </Carousel>

      {/* Testimonial Section */}
      <div className="absolute bottom-0 left-0 flex items-center pb-16 pl-10">
        <Avatar.Group spacing="sm">
          {avatars.map((item, index) => (
            <Avatar
              key={uid + item.image}
              src={item.image}
              alt={item.alt}
              size={56}
            >
              {item.alt}
            </Avatar>
          ))}
        </Avatar.Group>
        <div className="flex flex-col ml-5">
          <div className="mb-2 flex items-center gap-1">
            <Rating value={4.5} fractions={2} readOnly size="sm" />
            <Text size="md" fw={500} c="white">
              4.7
            </Text>
          </div>
          <Text size="sm" c="white">
            from 200+ reviews
          </Text>
        </div>
      </div>
    </div>
  );
};

export default SignUpSlider;
