"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, MessageSquare } from "lucide-react"
import { checkPhoneNumber, requestOTP, verifyOTP } from "@/lib/actions"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [initialUserId, setInitialUserId] = useState("")

  async function handlePhoneSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const user_id = await checkPhoneNumber(phoneNumber) //throws error if phone number is not registered
      setInitialUserId(user_id)
      const result = await requestOTP(phoneNumber)
      setMessage(result.success ? "Verification code sent" : "Failed to send verification code")
      setStep("otp")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOTPSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await verifyOTP(phoneNumber, otpCode, initialUserId)
      router.push("/")
      router.refresh() 
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  function handleBackToPhone() {
    setStep("phone")
    setOtpCode("")
    setError("")
    setMessage("")
  }

  if (step === "otp") {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Enter Verification Code
            </CardTitle>
            <CardDescription>We sent a 6-digit code to {phoneNumber}</CardDescription>
          </CardHeader>
          <form onSubmit={handleOTPSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-white bg-red-500/90 rounded-md">{error}</div>}
              {message && <div className="p-3 text-sm text-white bg-green-500/90 rounded-md">{message}</div>}
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleBackToPhone}>
                Use Different Phone Number
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            Sign In to VTHacks
          </CardTitle>
          <CardDescription>Enter your phone number to receive a verification code</CardDescription>
        </CardHeader>
        <form onSubmit={handlePhoneSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-white bg-red-500/90 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Only registered participants can access the app
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
