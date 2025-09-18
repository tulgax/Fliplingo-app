'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Settings, CreditCard, HelpCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
  email?: string
  avatarUrl?: string
  name?: string
}

const initialsFrom = (name?: string, email?: string) => {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  }
  return (email?.[0] ?? 'U').toUpperCase()
}

export const UserMenu = ({ email, avatarUrl, name }: Props) => {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open user menu">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt="avatar" />
            <AvatarFallback>{initialsFrom(name, email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="min-w-56">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt="avatar" />
            <AvatarFallback>{initialsFrom(name, email)}</AvatarFallback>
          </Avatar>
        </DropdownMenuLabel>
        <DropdownMenuItem disabled className="cursor-default text-sm opacity-100 focus:bg-transparent">
          {email ?? 'Account'}
        </DropdownMenuItem>
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
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


