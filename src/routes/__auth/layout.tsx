import WithoutAuthLayout from '@/components/hoc/WithoutAuthLayout';
import { Outlet } from '@modern-js/runtime/router';

export default function Layout() {
  return (
    <WithoutAuthLayout>
      <Outlet />
    </WithoutAuthLayout>
  );
}
