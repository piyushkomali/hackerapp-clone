"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Trophy, Calendar } from "lucide-react"
import { getUserRaffleTickets } from "@/lib/data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RaffleTicket {
  id: string
  userId: string
  eventId: string
  checkInId: string
  createdAt: string
  event: {
    id: string
    title: string
    description: string
    location: string
    startTime: string
    endTime: string
    type: string
  }
  checkInTimestamp: string
}

interface RaffleEntriesProps {
  userId: string
}

export function RaffleEntries({ userId }: RaffleEntriesProps) {
  const [tickets, setTickets] = useState<RaffleTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRaffleTickets() {
      try {
        const data = await getUserRaffleTickets(userId)
        setTickets(data)
      } catch (error) {
        console.error("Failed to load raffle tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRaffleTickets()
  }, [userId])

  if (loading) {
    return <div>Loading raffle entries...</div>
  }

  if (tickets.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No raffle entries yet</AlertTitle>
        <AlertDescription>Check in to events using your QR code to earn raffle entries.</AlertDescription>
      </Alert>
    )
  }

  // Group tickets by event type
  const workshopTickets = tickets.filter((ticket) => ticket.event.type === "workshop")
  const foodTickets = tickets.filter((ticket) => ticket.event.type === "food")
  const activityTickets = tickets.filter((ticket) => ticket.event.type === "activity")
  const ceremonyTickets = tickets.filter((ticket) => ticket.event.type === "ceremony")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Total Raffle Entries: {tickets.length}</span>
          </CardTitle>
          <CardDescription>Each event check-in earns you one raffle entry</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
          <TabsTrigger value="workshops">Workshops ({workshopTickets.length})</TabsTrigger>
          <TabsTrigger value="food">Food ({foodTickets.length})</TabsTrigger>
          <TabsTrigger value="activities">Activities ({activityTickets.length})</TabsTrigger>
          <TabsTrigger value="ceremonies">Ceremonies ({ceremonyTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RaffleTicketList tickets={tickets} />
        </TabsContent>

        <TabsContent value="workshops" className="mt-4">
          <RaffleTicketList tickets={workshopTickets} />
        </TabsContent>

        <TabsContent value="food" className="mt-4">
          <RaffleTicketList tickets={foodTickets} />
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <RaffleTicketList tickets={activityTickets} />
        </TabsContent>

        <TabsContent value="ceremonies" className="mt-4">
          <RaffleTicketList tickets={ceremonyTickets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RaffleTicketListProps {
  tickets: RaffleTicket[]
}

function RaffleTicketList({ tickets }: RaffleTicketListProps) {
  if (tickets.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No entries in this category</AlertTitle>
        <AlertDescription>Check in to more events to earn raffle entries in this category.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div className="grid gap-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{ticket.event.title}</h3>
                  <Badge variant="outline" className="ml-2">
                    {ticket.event.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{new Date(ticket.checkInTimestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ticket ID: {ticket.id.substring(0, 8)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
