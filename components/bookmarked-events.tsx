"use client"

import { EventCard } from "@/components/event-card"
import type { Event, Session } from "@/lib/types"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BookmarkedEvents({ user, events }: { user: Session | null, events: Event[] } ) {

  if (events.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No bookmarked events</AlertTitle>
        <AlertDescription>
          You haven&apos;t bookmarked any events yet. Browse the schedule and bookmark events you&apos;re interested in.
        </AlertDescription>
      </Alert>
    )
  }

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} user={user} event={event} />
      ))}
    </div>
  )
}
