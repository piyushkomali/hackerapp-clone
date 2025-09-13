"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateQRCode, logout } from "@/lib/actions"
import { QrCode, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QRCodeDisplayProps {
  userId: string
}

export function QRCodeDisplay({ userId }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadQRCode()
  }, [userId])

  async function loadQRCode() {
    try {
      setIsLoading(true)
      const qrData = await generateQRCode(userId)
      setQrCodeUrl(qrData.url)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Your Check-in QR Code
            </CardTitle>
            <CardDescription>Show this QR code to check in to events and earn raffle entries</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        {isLoading ? (
          <div className="w-64 h-64 bg-muted animate-pulse rounded-md" />
        ) : qrCodeUrl ? (
          <div className="border rounded-md p-4 bg-white">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="Check-in QR Code" className="w-56 h-56" />
          </div>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center border rounded-md">Failed to load QR code</div>
        )}
      </CardContent>
    </Card>
  )
}
