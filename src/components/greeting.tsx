"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function Greeting() {
  const { user, isLoaded } = useUser()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  if (!isLoaded) return null

  return (
    <h1 className="text-2xl p-10 font-semibold">
      {greeting}, {user?.firstName || "User"} 👋
    </h1>
  )
}
