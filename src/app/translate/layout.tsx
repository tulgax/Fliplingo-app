import { Sidebar } from '@/components/sidebar'

export default function TranslateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh w-full bg-background text-foreground">
      <Sidebar />
      <div className="ml-40">{children}</div>
    </div>
  )
}


