import Providers from '@/components/providers/Providers';
import { ColorSchemeScript } from '@mantine/core';
import { Helmet } from '@modern-js/runtime/head';
import { Outlet } from '@modern-js/runtime/router';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/nprogress/styles.css';
import './index.css';

export default function Layout() {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
        />
      </Helmet>
      {/*  */}
      <ColorSchemeScript />
      <Providers>
        <Outlet />
      </Providers>
    </>
  );
}
