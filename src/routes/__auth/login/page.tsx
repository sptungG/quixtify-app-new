import { Logo02Svg } from '@/components/icons/LogoSvg';
import useTranslation from '@/hooks/useTranslation';
import { regexEmail } from '@/utils/utils';
import { notifyError, notifySuccess } from '@/utils/utils-mantine';
import { supabase } from '@/utils/utils-supabase';
import Yup, { passwordSchema } from '@/utils/utils-yup';
import {
  Anchor,
  Button,
  Input,
  PasswordInput,
  ScrollArea,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useId } from '@mantine/hooks';
import { Link, useNavigate } from '@modern-js/runtime/router';
import { yupResolver } from 'mantine-form-yup-resolver';
import React, { useState } from 'react';

// ====================

type TLoginPageProps = { children?: React.ReactNode };

const LoginPage = ({ children }: TLoginPageProps) => {
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
    },
  });

  const handleSubmitForm = methodForm.onSubmit(
    async ({ email, password }) => {
      setPageStatus('loading');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          // setAt(data.session.access_token);
          methodForm.reset();
          notifySuccess({ title: t('Success'), message: t('Logged in') });
          navigate('/');
        }
      } catch (error: any) {
        console.log('error:', error);
        notifyError({
          title: t('Error'),
          message: error.message || t('Login failed'),
        });
      } finally {
        setPageStatus('');
      }
    },
    formErrors => {
      console.log('~ formErrors:', formErrors);
    },
  );

  // const handleGoogleLogin = async () => {
  //   try {
  //     setPageStatus('Google-loading');

  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback`,
  //       },
  //     });

  //     if (error) throw error;

  //     setPageStatus('');
  //   } catch (error: any) {
  //     console.log('error:', error);
  //     notifications.show({
  //       title: t('Error'),
  //       message: error.message || t('Google login failed'),
  //       color: 'red',
  //     });
  //     setPageStatus('');
  //   }
  // };

  return (
    <div className="flex flex-col">
      <ScrollArea h="100dvh" w="100%">
        <div className="relative flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="flex w-full max-w-[480px] flex-col items-center">
            <div className="mb-5 shrink-0">
              <Logo02Svg className="size-11" />
            </div>

            <Text className="mb-10 font-sora text-2xl font-bold">
              {t('Welcome back to Quixtify')}
            </Text>

            {/* Uncomment for Google Sign In */}

            <form
              id={`${uid}LoginForm`}
              onSubmit={handleSubmitForm}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const res = methodForm.validate();
                  if (!res?.hasErrors) handleSubmitForm();
                }
              }}
              className="mb-8 w-full"
            >
              <div className="flex flex-col mb-8 gap-6">
                {/* Email Field */}
                <TextInput
                  label={t('Email address')}
                  placeholder="john@example.com"
                  type="email"
                  autoComplete="on"
                  withAsterisk
                  key={methodForm.key('email')}
                  {...methodForm.getInputProps('email')}
                />

                {/* Password Field */}
                <div className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <Input.Label required htmlFor="password" className="mb-0">
                      {t('Password')}
                    </Input.Label>
                    <Anchor component={Link} to="/forgot-password" size="xs">
                      {t('Forgot your password')}?
                    </Anchor>
                  </div>

                  <PasswordInput
                    id="password"
                    placeholder=""
                    autoComplete="on"
                    key={methodForm.key('password')}
                    {...methodForm.getInputProps('password')}
                  />
                </div>
              </div>

              <Button
                disabled={pageStatus === 'loading'}
                loading={pageStatus === 'loading'}
                type="submit"
                className="mb-10 w-full rounded-full font-bold"
              >
                {t('Continue with email')}
              </Button>
            </form>

            <Text className="text-center text-sm leading-[1.4]">
              {t("Don't have an account")}?{' '}
              <Anchor component={Link} to="/sign-up" fw={700}>
                {t('Sign up')}
              </Anchor>
            </Text>
          </div>

          {/* <Version className="absolute bottom-[calc(var(--safe-b)+0.75rem)] left-1/2 -translate-x-1/2 opacity-60" /> */}
        </div>
      </ScrollArea>
    </div>
  );
};

// ====================

const Schema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(regexEmail, 'Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .concat(passwordSchema)
    .required('Password is required'),
});

export default LoginPage;
