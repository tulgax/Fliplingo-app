'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GEMINI_TRANSLATION_LANGUAGES } from '@/lib/languages/gemini'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export type LanguageOption = { label: string; value: string }

const defaultLanguages: LanguageOption[] = GEMINI_TRANSLATION_LANGUAGES

type Props = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  languages?: LanguageOption[]
  buttonClassName?: string
}

export const LanguageCombobox = ({
  value,
  onChange,
  placeholder = 'Select language',
  languages = defaultLanguages,
  buttonClassName,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<string | undefined>(value)
  const selected = languages.find((l) => l.value === (value ?? internal))

  const setValue = (next: string) => {
    setInternal(next)
    onChange?.(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-10 w-full justify-between', buttonClassName)}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => setValue(currentValue)}
                >
                  {language.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      (value ?? internal) === language.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


