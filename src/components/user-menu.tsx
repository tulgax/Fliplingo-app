'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Settings, CreditCard, HelpCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type Props = {
  email?: string
  avatarUrl?: string
}

export const UserMenu = ({ email, avatarUrl }: Props) => {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open user menu">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" width={28} height={28} className="rounded-full" />
          ) : (
            <Image src="/vercel.svg" alt="Avatar" width={28} height={28} className="rounded-full dark:invert" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Image src={avatarUrl || '/vercel.svg'} alt="Avatar" width={32} height={32} className="rounded-full dark:invert" />
          <div className="grid leading-tight">
            <span className="text-sm font-medium">Profile</span>
            {email && <span className="text-xs text-muted-foreground truncate max-w-[180px]">{email}</span>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


