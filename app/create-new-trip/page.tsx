"use client"

import React, { useState } from "react"
import ChatBox from "./components/chatbox"
import MapTrip from "./components/map_trip"

const CreateNewTrip = () => {
  const [tripData, setTripData] = useState<any>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-screen">

      {/* ================= LEFT: CHAT ================= */}
      <div className="md:col-span-5 border-r dark:border-slate-700">
        <ChatBox setTripData={setTripData} />
      </div>

      {/* ================= RIGHT: MAP + TRIP ================= */}
      <div className="md:col-span-7 h-screen">
        <MapTrip trip={tripData} />
      </div>

    </div>
  )
}

export default CreateNewTrip