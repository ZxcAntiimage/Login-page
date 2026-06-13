"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Auth, useAuth } from "@/features/api/auth"

export default function Main() {
  const router = useRouter()
  const { getProfile, isLoading, error } = useAuth()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const isAuthenticated = Auth.isAuthenticated()

    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    const fetchProfile = async () => {
      try {
        const profileData = await getProfile()
        setUser(profileData)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      }
    }

    fetchProfile()
  }, [router, getProfile])

  const handleLogout = () => {
    Auth.handleLogout()
  }

  return (
    <div className="flex h-full w-full items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Welcome to the Home Page!</h1>

      {user ? (
        <>
          <p className="text-gray-600">Hello, {user.firstName} {user.lastName}!</p>
          <p className="text-gray-500">Email: {user.email}</p>
        </>
      ) : (
        <p className="text-gray-600">Loading user information...</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-red-500! text-white! rounded-md hover:bg-red-600 transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}
