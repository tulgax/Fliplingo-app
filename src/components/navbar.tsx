import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavbarLinks } from '@/components/navbar-links'
import { UserMenu } from '@/components/user-menu'
export const dynamic = 'force-dynamic'

export const Navbar = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const email = user?.email
  const avatarUrl = user?.user_metadata?.avatar_url
  const isAuthed = Boolean(user)
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-6 md:px-8">
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <img
            src="https://zkprxfzgywsqzhqcbisk.supabase.co/storage/v1/object/public/Branding/White%20Logo.svg"
            alt="Logo"
            className="h-6 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-2">
          <NavbarLinks />
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <UserMenu email={email} avatarUrl={avatarUrl} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-foreground/10">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


