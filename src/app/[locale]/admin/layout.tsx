import Link from "next/link";

// Admin is English-only and lives outside the storefront chrome. It is
// protected by basic-auth in src/proxy.ts (ADMIN_USER / ADMIN_PASS).
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/admin`;
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link href={base} className="font-semibold text-primary">
            Pustak Maitri · Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={base} className="text-muted-foreground hover:text-foreground">
              Orders
            </Link>
            <Link href={`${base}/books`} className="text-muted-foreground hover:text-foreground">
              Books
            </Link>
            <Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground">
              ← Storefront
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
