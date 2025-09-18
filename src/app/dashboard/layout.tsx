import { Navbar } from '@/components/navbar'

export default function TranslateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh w-full bg-background text-foreground">
      {/* Top navigation bar */}
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-6">{children}</main>
    </div>
  )
}


