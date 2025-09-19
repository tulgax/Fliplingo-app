import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-8 md:px-8">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Fliplingo</p>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/support" className="text-muted-foreground hover:text-foreground">
            Support
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}


