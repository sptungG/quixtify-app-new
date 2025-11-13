import Providers from '@/components/providers/Providers';
import { ColorSchemeScript } from '@mantine/core';
import { Outlet } from '@modern-js/runtime/router';

import './index.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import { Helmet } from '@modern-js/runtime/head';

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
