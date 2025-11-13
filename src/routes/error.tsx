import { useRouteError } from '@modern-js/runtime/router';
const ErrorBoundary = () => {
  const error = useRouteError() as { data: string };
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-500">{error.data}</p>
      <button
        className="mt-4 rounded-full bg-primary px-4 py-2 font-semibold text-white"
        type="button"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorBoundary;
