"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import ChatBox from "./components/chatbox"
import MapTrip from "./components/map_trip"

const CreateNewTripClient = () => {
  const [tripData, setTripData] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('🔍 Client-side session check:', !!session)
      
      if (!session) {
        router.push('/?auth=signup')
      } else {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Checking authentication...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-screen">
      <div className="md:col-span-5 border-r dark:border-slate-700">
        <ChatBox setTripData={setTripData} />
      </div>
      <div className="md:col-span-7 h-screen">
        <MapTrip trip={tripData} />
      </div>
    </div>
  )
}

export default CreateNewTripClient