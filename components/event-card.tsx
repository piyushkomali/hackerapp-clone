"use client"

import { useState } from "react"
import { BookmarkIcon, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Event, User } from "@/lib/types"
import { toggleBookmark } from "@/lib/actions"
import { cn } from "@/lib/utils"
import type { Session } from "@/lib/types"

interface EventCardProps {
  user: Session | null
  event: Event
  showBookmarkButton?: boolean
}

export function EventCard({ user, event, showBookmarkButton = true }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(event.isBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const date = new Date(event.startTime).toLocaleDateString("en-US", {
    weekday: "long",

  })
  const startTime = new Date(event.startTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const endTime = new Date(event.endTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  async function handleToggleBookmark() {
    if (!user) {
      window.location.href = "/login"
      return
    }

    setIsLoading(true)
    try {
      const result = await toggleBookmark(event.id, user.user as User)
      setIsBookmarked(result.isBookmarked)
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription className="mt-0.5">{event.description}</CardDescription>
          </div>
          {showBookmarkButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleBookmark}
              disabled={isLoading || !user}
              className={cn("h-8 w-8", isBookmarked && "text-yellow-500 hover:text-yellow-600")}
            >
              <BookmarkIcon className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
              <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Add bookmark"}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>
              {startTime} - {endTime} | {date}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
          {event.type}
        </div>
      </CardFooter>
    </Card>
  )
}
