import {
  Anchor,
  Button,
  Checkbox,
  Input,
  MantineColorsTuple,
  MantineProvider as MantineProvider_,
  PasswordInput,
  Select,
  Switch,
  createTheme,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Link } from '@modern-js/runtime/router';
import { EyeOffIcon } from 'lucide-react';
import type React from 'react';
import { EyeSvg } from '../icons';

const purple: MantineColorsTuple = [
  '#f7ecff',
  '#e7d6fb',
  '#caaaf1',
  '#ac7ce8',
  '#9354e0',
  '#833bdb',
  '#7b2eda',
  '#6921c2',
  '#5d1cae',
  '#501599',
];

const VisibilityToggleIcon = ({ reveal }: { reveal: boolean }) =>
  reveal ? (
    <EyeSvg
      style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }}
    />
  ) : (
    <EyeOffIcon
      style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }}
    />
  );

const theme = createTheme({
  fontFamily: 'var(--font-inter), sans-serif',
  headings: {
    fontFamily: 'var(--font-sora), sans-serif',
  },
  colors: {
    purple,
  },
  defaultRadius: 'md',
  primaryColor: 'purple',
  components: {
    Input: Input.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: {
        input: 'text-sm',
      },
    }),

    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },

    Switch: Switch.extend({
      defaultProps: {
        withThumbIndicator: false,
      },
    }),

    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        labelProps: {
          className: 'text-sm font-semibold mb-2',
        },
        errorProps: {
          className: 'text-xs',
        },
      },
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: {
        labelProps: {
          className: 'text-sm font-semibold mb-2',
        },
        visibilityToggleIcon: VisibilityToggleIcon,
      },
    }),

    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: 'md',
      },
    }),

    Select: Select.extend({
      defaultProps: {
        size: 'md',
      },
      classNames: { option: 'text-sm' },
    }),

    Button: Button.extend({
      defaultProps: {
        radius: 'xl',
        size: 'md',
      },
    }),

    Anchor: Anchor.extend({
      defaultProps: {
        underline: 'always',
        size: 'sm',
      },
    }),
  },
});

type TMantineProviderProps = { children?: React.ReactNode };

const MantineProvider = ({ children }: TMantineProviderProps) => {
  return <MantineProvider_ theme={theme}>{children}</MantineProvider_>;
};

export default MantineProvider;
