"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChartIcon as ChartPie, BarChart3 } from "lucide-react"

interface EventStats {
  event_title: string
  count: number
}

interface TypeStats {
  event_type: string
  count: number
}

interface UserStats {
  user_name: string
  count: number
}

export default function RaffleStatsPage() {
  const [eventStats, setEventStats] = useState<EventStats[]>([])
  const [typeStats, setTypeStats] = useState<TypeStats[]>([])
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = getSupabaseBrowserClient()

        // Get stats by event
        const { data: eventData } = await supabase
          .from("raffle_tickets")
          .select(`
            events:event_id (
              title
            ),
            count: count()
          `)
          .group("events->title")
          .order("count", { ascending: false })

        if (eventData) {
          setEventStats(
            eventData.map((item) => ({
              event_title: item.events.title,
              count: item.count,
            })),
          )
        }

        // Get stats by event type
        const { data: typeData } = await supabase
          .from("raffle_tickets")
          .select(`
            events:event_id (
              type
            ),
            count: count()
          `)
          .group("events->type")
          .order("count", { ascending: false })

        if (typeData) {
          setTypeStats(
            typeData.map((item) => ({
              event_type: item.events.type,
              count: item.count,
            })),
          )
        }

        // Get stats by user
        const { data: userData } = await supabase
          .from("raffle_tickets")
          .select(`
            users:user_id (
              name
            ),
            count: count()
          `)
          .group("users->name")
          .order("count", { ascending: false })
          .limit(10)

        if (userData) {
          setUserStats(
            userData.map((item) => ({
              user_name: item.users.name,
              count: item.count,
            })),
          )
        }
      } catch (error) {
        console.error("Failed to load raffle stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="container max-w-4xl pt-4 pb-20">Loading raffle statistics...</div>
  }

  // Colors for pie chart
  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"]

  return (
    <div className="container max-w-4xl pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Raffle Statistics</h1>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="types">Event Types</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Raffle Entries by Event
              </CardTitle>
              <CardDescription>Number of raffle tickets issued per event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventStats} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event_title" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Raffle Entries by Event Type
              </CardTitle>
              <CardDescription>Distribution of raffle tickets by event category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="event_type"
                    >
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top 10 Users by Raffle Entries
              </CardTitle>
              <CardDescription>Users with the most raffle tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userStats} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="user_name" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
