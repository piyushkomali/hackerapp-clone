"use client"

import { useEffect, useState } from "react"
import type { Session } from "./types"

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SessionStatus>("loading")

  useEffect(() => {
    async function loadSession() {
      try {
        // In a real app, you would use a proper auth hook
        // For demo purposes, we'll check for a session cookie
        const sessionCookie = document.cookie.split("; ").find((row) => row.startsWith("session="))

        if (sessionCookie) {
          const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]))
          setSession({ user: sessionData })
          setStatus("authenticated")
        } else {
          setSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        setSession(null)
        setStatus("unauthenticated")
      }
    }

    loadSession()
  }, [])

  return { session, status }
}
