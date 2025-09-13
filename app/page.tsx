import { Suspense } from "react"
import { EventSchedule } from "@/components/event-schedule"
import { EventSkeleton } from "@/components/event-skeleton"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const user = await auth()


  return (
    <div className="container max-w-4xl pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">VTHacks Schedule</h1>
      </div>
      <Suspense fallback={<EventSkeleton />}>
        <EventSchedule user={user} />
      </Suspense>
    </div>
  )
}
