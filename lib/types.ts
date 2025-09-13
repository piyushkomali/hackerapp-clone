export interface User {
  id: string
  name: string
  phone_number: string
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  type: "workshop" | "activity" | "food" | "ceremony"
  isBookmarked?: boolean
}

export interface Checkin {
  id: string
  userId: string
  eventId: string
  timestamp: string
  event: Event
}

export interface Session {
  user: User
}
