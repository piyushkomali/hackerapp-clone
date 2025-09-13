"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { recordCheckIn } from "@/lib/actions"
import { getEvents } from "@/lib/data"
import { useEffect } from "react"
import type { Event } from "@/lib/types"
import { QrCodeIcon as QrScan, CheckCircle2 } from "lucide-react"

export default function CheckInPage() {
  const [userId, setUserId] = useState("")
  const [eventId, setEventId] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setLoadingEvents(false)
      }
    }

    loadEvents()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!userId || !eventId) {
      toast({
        title: "Missing information",
        description: "Please provide both user ID and event",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await recordCheckIn(userId, eventId)

      if (result.success) {
        toast({
          title: "Check-in successful",
          description: "Raffle ticket has been issued to the user",
          variant: "default",
        })
        setUserId("")
      } else {
        toast({
          title: "Check-in failed",
          description: result.message || "User has already checked in to this event",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: "There was an error processing the check-in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md pt-8 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrScan className="h-5 w-5" />
            Event Check-in
          </CardTitle>
          <CardDescription>Check in hackers to events and issue raffle tickets</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user ID or scan QR code"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger id="event" disabled={loadingEvents}>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Check In & Issue Raffle Ticket
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
