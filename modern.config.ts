import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: { router: true },
  plugins: [appTools({ bundler: 'rspack' })],
  output: {
    distPath: {
      js: '',
      css: '',
      html: '',
    },
  },
  source: { mainEntryName: 'index' },
  html: {
    outputStructure: 'flat',
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require('@tailwindcss/postcss'),
          require('postcss-preset-mantine'),
        ],
      },
    },
  },
});
