"use client"

import type { Event, Checkin, Session } from "./types"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export async function getEvents(user: Session | null): Promise<Event[]> {
  const userId = user?.user.id
  console.log(userId)

  const supabase = createBrowserSupabaseClient()

  // Get all events
  const { data: events, error } = await supabase.from("events").select("*").order("start_time", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  // If user is logged in, check which events are bookmarked
  if (userId) {
    const { data: bookmarks } = await supabase.from("bookmarks").select("event_id").eq("user_id", userId)

    const bookmarkedEventIds = bookmarks?.map((b) => b.event_id) || []

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.start_time,
      endTime: event.end_time,
      type: event.type,
      isBookmarked: bookmarkedEventIds.includes(event.id),
    }))
  }

  // If no user is logged in, return events without bookmark info
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startTime: event.start_time,
    endTime: event.end_time,
    type: event.type,
    isBookmarked: false,
  }))
}


export async function getUserCheckins(userId: string): Promise<Checkin[]> {
  const supabase = createBrowserSupabaseClient()

  // Get check-ins with event details for the user
  const { data, error } = await supabase
    .from("check_ins")
    .select(`
      id,
      user_id,
      event_id,
      timestamp,
      events:event_id (
        id,
        title,
        description,
        location,
        start_time,
        end_time,
        type
      )
    `)
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching user check-ins:", error)
    return []
  }

  // Filter out records where events is null and map the data
  return data
    .filter((item) => item.events !== null) // Filter out null events
    .map((item) => ({
      id: item.id,
      userId: item.user_id,
      eventId: item.event_id,
      timestamp: item.timestamp,
      event: {
        id: item.events!.id, // Use non-null assertion since we filtered
        title: item.events!.title,
        description: item.events!.description,
        location: item.events!.location,
        startTime: item.events!.start_time,
        endTime: item.events!.end_time,
        type: item.events!.type,
      },
    }))
}

export async function getUserRaffleTickets(userId: string) {
  const supabase = createBrowserSupabaseClient()

  // Get raffle tickets with event and check-in details
  const { data, error } = await supabase
    .from("raffle_tickets")
    .select(`
      id,
      user_id,
      event_id,
      check_in_id,
      created_at,
      events:event_id (
        id,
        title,
        description,
        location,
        start_time,
        end_time,
        type
      ),
      check_ins:check_in_id (
        timestamp
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user raffle tickets:", error)
    return []
  }

  // Filter out records where events is null and map the data
  return data
    .filter((item) => item.events !== null && item.check_ins !== null) // Filter out null events and check-ins
    .map((item) => ({
      id: item.id,
      userId: item.user_id,
      eventId: item.event_id,
      checkInId: item.check_in_id,
      createdAt: item.created_at,
      event: {
        id: item.events!.id, // Use non-null assertion since we filtered
        title: item.events!.title,
        description: item.events!.description,
        location: item.events!.location,
        startTime: item.events!.start_time,
        endTime: item.events!.end_time,
        type: item.events!.type,
      },
      checkInTimestamp: item.check_ins!.timestamp,
    }))
}
