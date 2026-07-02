import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0l2-2m-2 2l-2-2"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">
            AI Car Matchmaker
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/questionnaire"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-600"
          >
            Find My Car
          </Link>
          <Link
            href="/history"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-600"
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          AI Car Matchmaker — Find your perfect Indian car match.
        </p>
      </div>
    </footer>
  );
}
