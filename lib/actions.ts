"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminSupabase, serverClient } from "@/lib/supabase/server"
import { isValidPhoneNumber } from "@/lib/sms-service"
import type { Session, User, Event } from "./types"
import { auth } from "./auth"

export async function checkPhoneNumber(phoneNumber: string) {
  try {
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error("Invalid phone number")
    }


    const { data, error } = await adminSupabase.from("users").select("*").eq("phone_number", phoneNumber).single()
    if (error) {
      console.error(error.message)
      throw new Error("You may not be registered for VTHacks. Contact the organizers for assistance.")
    }

    return data.id
  } catch (error) {
    // Re-throw the error to maintain the same error handling behavior
    throw error
  }
}

export async function requestOTP(phoneNumber: string) {
  const supabase = await serverClient()
  const {data, error} = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
  })
  if (error) {
    console.error(error)
    throw new Error("Failed to send verification code. Please try again.")
  }
  return { success: true }
}

export async function verifyOTP(phoneNumber: string, code: string, user_id: string) {
  const supabase = await serverClient()
  const { data: {session}, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: code,
    type: "sms",
  })
  if (error) {
    console.error(error)
    throw new Error("Failed to verify verification code. Please try again.")
  }

  // Update the users table to set the id field to session.user.id for the matching phoneNumber
  if (session?.user?.id && user_id !== session.user.id) {
    
    const { error: updateError } = await adminSupabase
      .from("users")
      .update({ id: session.user.id })
      .eq("phone_number", phoneNumber)

    
    if (updateError) {
      console.error("Failed to update user id:", updateError)
      throw new Error("Server error. Please try again.")
      // Don't throw error here as the OTP verification was successful
    }
  }
  
  return { success: true }
}

export async function logout() {
  const supabase = await serverClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function toggleBookmark(eventId: string, user: User) {
  const supabase = await serverClient()

  // Check if the event is already bookmarked
  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single()

  if (existingBookmark) {
    // Remove the bookmark
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("event_id", eventId)

    revalidatePath("/bookmarks")
    revalidatePath("/")
    return { isBookmarked: false }
  } else {
    // Add the bookmark
    await supabase.from("bookmarks").insert([{ user_id: user.id, event_id: eventId }])

    revalidatePath("/bookmarks")
    revalidatePath("/")
    return { isBookmarked: true }
  }
}

export async function updateProfile(data: { name: string }) {
  const { user } = await auth() as Session
  if (!user) {
    throw new Error("Not authenticated")
  }
  const supabase = await serverClient()

  // Update the user in Supabase
  const { error } = await supabase.from("users").update({ name: data.name }).eq("id", user.id)

  if (error) {
    throw new Error("Failed to update profile")
  }



  revalidatePath("/profile")
  return { success: true }
}

export async function generateQRCode(userId: string) {
  // In a real app, you would generate a QR code with a secure token
  // For demo purposes, we'll just return a placeholder URL

  // This would typically be a call to a QR code generation service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vthacks-user-${userId}`

  return { url: qrCodeUrl }
}

export async function recordCheckIn(userId: string, eventId: string) {
  const supabase = await serverClient()

  // Check if the user has already checked in to this event
  const { data: existingCheckIn } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  if (existingCheckIn) {
    return { success: false, message: "Already checked in to this event" }
  }

  // Create a new check-in record
  const { data: checkIn, error: checkInError } = await supabase
    .from("check_ins")
    .insert([
      {
        user_id: userId,
        event_id: eventId,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (checkInError || !checkIn) {
    throw new Error("Failed to record check-in")
  }

  // Create a raffle ticket for this check-in
  const { error: raffleError } = await supabase.from("raffle_tickets").insert([
    {
      user_id: userId,
      event_id: eventId,
      check_in_id: checkIn.id,
    },
  ])

  if (raffleError) {
    // If raffle ticket creation fails, we should still consider the check-in successful
    console.error("Failed to create raffle ticket:", raffleError)
  }

  revalidatePath("/raffle")
  return { success: true }
}

export async function getBookmarkedEvents(user: Session | null): Promise<Event[]> {
  if (!user) {
    return []
  }

  const supabase = await serverClient()
  const userId = user.user.id

  // Get bookmarked events for the user
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      event_id,
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

  if (error) {
    console.error("Error fetching bookmarked events:", error)
    return []
  }

  // Filter out records where events is null and map the data
  return data
    .filter((item: any) => item.events !== null) // Filter out null events
    .map((item: any) => ({
      id: item.events.id,
      title: item.events.title,
      description: item.events.description,
      location: item.events.location,
      startTime: item.events.start_time,
      endTime: item.events.end_time,
      type: item.events.type,
      isBookmarked: true,
    }))
}
