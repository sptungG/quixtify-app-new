'use client';

import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  ScrollArea,
  Text,
  TextInput,
} from '@mantine/core';
import { useId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from '@modern-js/runtime/router';
import React, { useState } from 'react';

import { LogoText01Svg } from '@/components/icons/LogoTextSvg';
// import Version from '@/components/ui-layout/Version';
import useTranslation from '@/hooks/useTranslation';
import SignUpSlider from '@/modules/auth/components/SignUpSlider';
import { regexEmail } from '@/utils/utils';
import { notifyError, notifySuccess } from '@/utils/utils-mantine';
import { supabase } from '@/utils/utils-supabase';
import Yup, { passwordSchema } from '@/utils/utils-yup';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { isDesktop } from 'react-device-detect';

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
    <div className="flex h-dvh flex-nowrap">
      {/* Left Sidebar - Desktop Only */}
      {isDesktop && <SignUpSlider />}

      {/* Right Content Area */}
      <div className="min-w-0 flex-[1_1_auto] sm:max-w-[560px]">
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

            {/* <Version
            pos="absolute"
            bottom="calc(var(--safe-b) + 12px)"
            left="50%"
            style={{
              transform: 'translateX(-50%)',
              opacity: 0.6,
            }}
          /> */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SignUpPage;
