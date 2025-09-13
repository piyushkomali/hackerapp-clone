"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEvents } from "@/lib/data"
import type { Event, Session } from "@/lib/types"

export function EventSchedule({ user }: { user: Session | null }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents(user)
        setEvents(data)
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Group events by day
  const days = [
    ...new Set(
      events.map((event) => {
        const date = new Date(event.startTime)
        return date.toLocaleDateString("en-US", { weekday: "long" })
      }),
    ),
  ].sort((a, b) => {
    const days = ["Friday", "Saturday", "Sunday"]
    return days.indexOf(a) - days.indexOf(b)
  })

  if (loading) {
    return <div>Loading events...</div>
  }

  return (
    <Tabs defaultValue={days[0] || "Friday"} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
        {days.map((day) => (
          <TabsTrigger key={day} value={day}>
            {day}
          </TabsTrigger>
        ))}
      </TabsList>

      {days.map((day) => (
        <TabsContent key={day} value={day} className="mt-4 space-y-4">
          {events
            .filter((event) => {
              const date = new Date(event.startTime)
              return date.toLocaleDateString("en-US", { weekday: "long" }) === day
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((event) => (
              <EventCard key={event.id} user={user} event={event} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
