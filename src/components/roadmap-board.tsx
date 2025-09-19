"use client"

import { useMemo, useState } from 'react'
import { Ban, CalendarDays, ChevronUp, FlaskConical, Loader2, PauseCircle, Rocket, Sparkles } from 'lucide-react'
interface RoadmapItem {
  id: string
  title: string
  description?: string
  link?: string
  date?: string
  votes?: number
}

interface RoadmapColumn {
  id: string
  title: string
  items: RoadmapItem[]
}

interface RoadmapBoardProps {
  columns: RoadmapColumn[]
}

export const RoadmapBoard = ({ columns }: RoadmapBoardProps) => {
  const initialVotes = useMemo(() => {
    const seed: Record<string, number> = {}
    columns.forEach((col) => {
      col.items.forEach((item) => {
        if (item && item.id) {
          const randomSeed = Math.floor(Math.random() * 1200) + 50 // 50 - 1249
          seed[item.id] = typeof item.votes === 'number' ? item.votes : randomSeed
        }
      })
    })
    return seed
  }, [columns])

  const [votesById, setVotesById] = useState<Record<string, number>>(initialVotes)

  const handleUpvote = (id: string) => {
    setVotesById((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  const IconForColumn: Record<string, React.ComponentType<{ className?: string }>> = {
    'new': Sparkles,
    'blocked': Ban,
    'exploring': FlaskConical,
    'on-hold': PauseCircle,
    'planned': CalendarDays,
    'in-progress': Loader2,
    'beta': FlaskConical,
    'released': Rocket,
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => {
            const Icon = IconForColumn[col.id] ?? Sparkles
            return (
              <div key={col.id} className="rounded-lg border border-border p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide">
                  <Icon className="h-4 w-4" />
                  {col.title}
                </h3>
              {col.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No posts found</p>
              ) : (
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.id} className="rounded-md border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.date ? (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {item.date}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          aria-label="Upvote"
                          onClick={() => handleUpvote(item.id)}
                          className="inline-flex flex-col items-center justify-center rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronUp className="h-4 w-4" />
                          <span>{votesById[item.id] ?? 0}</span>
                        </button>
                      </div>
                      {item.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      {item.link ? (
                        <a
                          className="mt-2 inline-block text-xs text-muted-foreground underline hover:text-foreground"
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View details
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


