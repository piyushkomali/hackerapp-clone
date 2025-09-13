"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookmarkIcon, HomeIcon, TicketIcon, UserIcon } from "lucide-react"

export default function NavBar() {
  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        <NavItem href="/" icon={<HomeIcon className="h-5 w-5" />} label="Home" isActive={pathname === "/"} />
        <NavItem
          href="/bookmarks"
          icon={<BookmarkIcon className="h-5 w-5" />}
          label="Bookmarks"
          isActive={pathname === "/bookmarks"}
        />
        <NavItem
          href="/profile"
          icon={<UserIcon className="h-5 w-5" />}
          label="Profile"
          isActive={pathname === "/profile"}
        />
        <NavItem
          href="/raffle"
          icon={<TicketIcon className="h-5 w-5" />}
          label="Raffle"
          isActive={pathname === "/raffle"}
        />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center h-full transition-colors ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}
