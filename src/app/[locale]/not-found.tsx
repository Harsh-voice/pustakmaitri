import Link from "next/link";

// Rendered by Next's error boundary; kept independent of the i18n request
// context (which is not always available here) by showing both languages.
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-5xl font-bold text-primary">404</p>
      <div className="space-y-1">
        <p className="devanagari text-lg">पान सापडले नाही</p>
        <p className="text-muted-foreground">Page not found</p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        मुखपृष्ठ / Home
      </Link>
    </div>
  );
}
