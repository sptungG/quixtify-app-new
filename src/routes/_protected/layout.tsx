import AuthLayout from '@/components/hoc/AuthLayout';
import WithoutAuthLayout from '@/components/hoc/WithoutAuthLayout';
import { Outlet } from '@modern-js/runtime/router';

export default function Layout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
