import { Suspense } from "react"
import { BookmarkedEvents } from "@/components/bookmarked-events"
import { EventSkeleton } from "@/components/event-skeleton"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBookmarkedEvents } from "@/lib/actions"

export default async function BookmarksPage() {
  const user = await auth()

  

  async function loadEvents() {
    try {
      const data = await getBookmarkedEvents(user)
      return data
    } catch (error) {
      console.error("Failed to load bookmarked events:", error)
      return []
    }
  }

  const events = await loadEvents()

  return (
    <div className="container max-w-4xl pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Bookmarks</h1>
      </div>
      <Suspense fallback={<EventSkeleton />}>
        <BookmarkedEvents user={user} events={events} />
      </Suspense>
    </div>
  )
}
