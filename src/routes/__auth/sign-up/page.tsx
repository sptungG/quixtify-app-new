import { LogoText01Svg } from '@/components/icons/LogoTextSvg';
import useTranslation from '@/hooks/useTranslation';
import { IMAGE_PATHNAME } from '@/utils/constants';
import { cn, regexEmail } from '@/utils/utils';
import { notifyError, notifySuccess } from '@/utils/utils-mantine';
import { supabase } from '@/utils/utils-supabase';
import Yup, { passwordSchema } from '@/utils/utils-yup';
import { Carousel } from '@mantine/carousel';
import {
  Anchor,
  Avatar,
  Button,
  Checkbox,
  PasswordInput,
  Rating,
  ScrollArea,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useId } from '@mantine/hooks';
import { Link, useNavigate } from '@modern-js/runtime/router';
import Autoplay from 'embla-carousel-autoplay';
import { yupResolver } from 'mantine-form-yup-resolver';
import React, { useState } from 'react';
import { isDesktop } from 'react-device-detect';

// ====================

type TSignUpPageProps = { children?: React.ReactNode };

const SignUpPage = ({ children }: TSignUpPageProps) => {
  const uid = useId();
  const { t } = useTranslation();
  const [pageStatus, setPageStatus] = useState('');

  const navigate = useNavigate();

  const methodForm = useForm({
    mode: 'uncontrolled',
    validate: yupResolver(Schema),
    validateInputOnChange: true,
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      termAccepted: false,
    },
  });

  const handleSubmitForm = methodForm.onSubmit(
    async ({ email, password, termAccepted }) => {
      setPageStatus('loading');
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          // setAt(data.session.access_token);
          methodForm.reset();
          notifySuccess({ title: t('Success'), message: t('Signed up') });
          navigate('/');
        }
      } catch (error: any) {
        console.log('error:', error);
        notifyError({
          title: t('Error'),
          message: error.message || t('Signed up failed'),
        });
      } finally {
        setPageStatus('');
      }
    },
    formErrors => {
      console.log('~ formErrors:', formErrors);
    },
  );

  return (
    <div className={cn('flex h-dvh flex-nowrap w-dvw')}>
      {/* Left Sidebar - Desktop Only */}
      {isDesktop && <SignUpSlider className="max-md:hidden" />}

      {/* Right Content Area */}
      <div className="min-w-0 flex-[1_1_auto] w-full mx-auto sm:max-w-[560px]">
        <ScrollArea h="100dvh" w="100%">
          <div className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="flex w-full max-w-[480px] flex-col items-center">
              <div className="relative mb-8 flex shrink-0 flex-col items-center justify-center self-start sm:hidden">
                <LogoText01Svg className="h-10 w-auto text-gray-900" />
              </div>

              <Text className="mb-4 self-start font-sora text-3xl font-bold max-sm:text-2xl">
                Create your free account
              </Text>

              <Text className="mb-10 self-start text-sm leading-[1.6] opacity-80 max-lg:text-left sm:pr-4">
                Create your free business account and join over 1,000+ business
                owners. No credit card required. Unlimited appointments.
              </Text>

              <form
                id={`${uid}SignUpForm`}
                onSubmit={handleSubmitForm}
                className="flex flex-col gap-6 w-full mb-8"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const res = methodForm.validate();
                    if (!res?.hasErrors) handleSubmitForm();
                  }
                }}
              >
                {/* Email Field */}
                <TextInput
                  label={t('Email address')}
                  placeholder=""
                  type="email"
                  autoComplete="on"
                  withAsterisk
                  key={methodForm.key('email')}
                  {...methodForm.getInputProps('email')}
                />

                {/* Password Field */}
                <PasswordInput
                  label={t('Password')}
                  withAsterisk
                  placeholder=""
                  autoComplete="off"
                  key={methodForm.key('password')}
                  {...methodForm.getInputProps('password')}
                />

                <PasswordInput
                  label={t('Confirm password')}
                  withAsterisk
                  placeholder=""
                  autoComplete="on"
                  key={methodForm.key('confirmPassword')}
                  {...methodForm.getInputProps('confirmPassword')}
                />

                {/* Terms and Conditions */}
                <Checkbox
                  label={
                    <Text size="sm">
                      {t('I agree to the')}{' '}
                      <Anchor
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        fw={600}
                      >
                        {t('Terms and Conditions')}
                      </Anchor>{' '}
                      {t('and')}{' '}
                      <Anchor
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        fw={600}
                      >
                        {t('Privacy Policy')}
                      </Anchor>
                    </Text>
                  }
                  key={methodForm.key('termAccepted')}
                  {...methodForm.getInputProps('termAccepted', {
                    type: 'checkbox',
                  })}
                />
              </form>

              <Button
                disabled={pageStatus === 'loading'}
                loading={pageStatus === 'loading'}
                onClick={() => {
                  handleSubmitForm();
                }}
                className="mb-10 w-full rounded-full font-bold"
              >
                {t('Continue with Email')}
              </Button>

              <div className="text-center text-sm leading-[1.4]">
                {t('Already have an account')}?{' '}
                <Anchor component={Link} to="/login" fw={700}>
                  {t('Log in')}
                </Anchor>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// ====================

const Schema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(regexEmail, 'Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .concat(passwordSchema)
    .required('Password is required'),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  termAccepted: Yup.boolean().test(
    'required',
    'Please accept the terms and conditions',
    value => !!value,
  ),
});

// ==================== COMPONENTS: LEFT SIDEBAR

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

const avatars = [
  { image: 'https://i.pravatar.cc/150?img=44', alt: 'A' },
  { image: 'https://i.pravatar.cc/150?img=41', alt: 'B' },
  { image: 'https://i.pravatar.cc/150?img=12', alt: 'C' },
  { image: 'https://i.pravatar.cc/150?img=13', alt: 'D' },
  { image: 'https://i.pravatar.cc/150?img=29', alt: 'E' },
];

type TSignUpSliderProps = { className?: string };
const SignUpSlider = ({ className }: TSignUpSliderProps) => {
  const uid = useId();
  const { t } = useTranslation();
  const autoplay = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false, stopOnFocusIn: false }),
  );

  return (
    <div
      className={cn(
        'relative min-w-0 shrink-0 max-w-[91.77dvh] flex-[1_1_auto] p-0',
        className,
      )}
    >
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
          <Carousel.Slide key={uid + item.id} pos="relative" w="auto" p={0}>
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
              <source
                src={`${cldVideo(item.id, item.v)}.mp4`}
                type="video/mp4"
              />
              <source
                src={`${cldVideo(item.id, item.v)}.webm`}
                type="video/webm"
              />
            </video>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 z-10 px-10 pb-40">
              <Text className="mb-6 font-sora text-4xl font-medium leading-[1.2] text-gray-50">
                {item.title}
              </Text>
              <Text className="text-lg text-gray-100">{t(item.desc)}</Text>
            </div>
          </Carousel.Slide>
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

export default SignUpPage;
