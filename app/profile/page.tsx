import { ProfileInfo } from "@/components/profile-info"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await auth()
  if (!user) {
    redirect("/login")
  }
  return (
    <div className="container max-w-4xl pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      </div>

      <div className="grid gap-6">
        <QRCodeDisplay userId={user.user.id} />
        <Separator />
        <ProfileInfo user={user.user} />
      </div>
    </div>
  )
}
