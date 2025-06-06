import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white dark:bg-gray-900">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-100">
            404 Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <Link
          href="/"
          aria-label="Return to homepage"
          className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white shadow-sm px-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          prefetch={false}
        >
          Return to website
        </Link>
      </div>
    </div>
  );
}
