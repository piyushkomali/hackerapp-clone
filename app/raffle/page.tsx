import { RaffleEntries } from "@/components/raffle-entries"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RafflePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container max-w-4xl pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Raffle Entries</h1>
      </div>

      <RaffleEntries userId={session.user.id} />
    </div>
  )
}
