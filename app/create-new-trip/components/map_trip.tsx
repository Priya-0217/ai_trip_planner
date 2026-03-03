"use client"

import React, { useState, useEffect } from "react"
import {
  MapPin,
  Hotel,
  CalendarDays,
  Clock,
  Ticket,
  Star,
  DollarSign,
  ExternalLink,
  Sparkles,
  Users,
  Wallet,
  Calendar,
  Image as ImageIcon,
} from "lucide-react"
import { Timeline } from "@/components/ui/timeline"
import { getWikimediaImage } from "@/utils/getWikimediaImage"
import Image from "next/image"
import { getPlaceholderImage } from "@/utils/placeholderImage"

type Props = {
  trip: any
}

const MapTrip = ({ trip }: Props) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [hoveredHotel, setHoveredHotel] = useState<number | null>(null)
  const [hotelImages, setHotelImages] = useState<Record<number, string>>({})
  const [activityImages, setActivityImages] = useState<Record<string, string>>({})
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  /* ================= FETCH HOTEL IMAGES ================= */
  useEffect(() => {
    if (!trip?.hotels) return

    // Batch fetch all hotel images
    const fetchHotelImages = async () => {
      const imagePromises = trip.hotels.map(async (hotel: any, index: number) => {
        // Skip if already loaded
        if (hotelImages[index]) return null

        const key = `hotel-${index}`
        setLoadingImages(prev => ({ ...prev, [key]: true }))

        // Check if image is already in the hotel object (pre-enriched)
        if (hotel.image) {
          try {
            const url = new URL(hotel.image)
            const host = url.hostname
            // Skip unsupported hosts (e.g., Unsplash) and fetch Wikimedia instead
            if (host !== "upload.wikimedia.org") {
              const img = await getWikimediaImage(`${hotel.hotel_name} ${trip.destination}`)
              setLoadingImages(prev => ({ ...prev, [key]: false }))
              return { index, image: img }
            }
          } catch {
            // Not a valid URL; fall through to fetch
          }
          setLoadingImages(prev => ({ ...prev, [key]: false }))
          return { index, image: hotel.image }
        }

        // Otherwise fetch from Wikimedia
        const img = await getWikimediaImage(
          `${hotel.hotel_name} ${trip.destination}`
        )

        setLoadingImages(prev => ({ ...prev, [key]: false }))
        return { index, image: img }
      })

      const results = await Promise.all(imagePromises)
      
      // Update state with all images at once
      const newImages: Record<number, string> = {}
      results.forEach(result => {
        if (result?.image) {
          newImages[result.index] = result.image
        }
      })
      
      if (Object.keys(newImages).length > 0) {
        setHotelImages(prev => ({ ...prev, ...newImages }))
      }
    }

    fetchHotelImages()
  }, [trip])

  /* ================= FETCH ACTIVITY IMAGES ================= */
  useEffect(() => {
    if (!trip?.itinerary) return

    // Batch fetch all activity images
    const fetchActivityImages = async () => {
      const imagePromises: Promise<{ key: string; image: string | null }>[] = []

      trip.itinerary.forEach((day: any) => {
        day.activities.forEach((act: any, i: number) => {
          const key = `${day.day}-${i}`
          
          // Skip if already loaded
          if (activityImages[key]) return

          imagePromises.push((async () => {
            setLoadingImages(prev => ({ ...prev, [key]: true }))

            // Check if image is already in the activity object (pre-enriched)
            if (act.image) {
              setLoadingImages(prev => ({ ...prev, [key]: false }))
              return { key, image: act.image }
            }

            // Otherwise fetch from Wikimedia
            const img = await getWikimediaImage(
              `${act.place_name} ${trip.destination}`
            )

            setLoadingImages(prev => ({ ...prev, [key]: false }))
            return { key, image: img }
          })())
        })
      })

      const results = await Promise.all(imagePromises)
      
      // Update state with all images at once
      const newImages: Record<string, string> = {}
      results.forEach(result => {
        if (result?.image) {
          newImages[result.key] = result.image
        }
      })
      
      if (Object.keys(newImages).length > 0) {
        setActivityImages(prev => ({ ...prev, ...newImages }))
      }
    }

    fetchActivityImages()
  }, [trip])

  if (!trip) {
    return (
      <div className="h-full flex items-center justify-center text-center px-8">
        <div className="space-y-6 max-w-md animate-fade-in">
          <div className="relative inline-block">
            <div className="text-7xl animate-float">✈️</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-ping" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Your Journey Awaits
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Answer a few questions on the left to generate a personalized itinerary 
              tailored just for you.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles size={14} className="text-violet-500" />
            <span>AI-powered trip planning</span>
          </div>
        </div>
      </div>
    )
  }

  const timelineData =
    trip.itinerary?.map((day: any, idx: number) => ({
      title: (
        <div className="space-y-1">
          <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Day {day.day}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
            {day.day_plan}
          </div>
          <div className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1 mt-2">
            <Clock size={12} />
            Best time: {day.best_time_to_visit_day}
          </div>
        </div>
      ),
      content: (
        <div className="space-y-3 pb-8">
          {day.activities.map((act: any, i: number) => {
            const key = `${day.day}-${i}`
            const isSelected = selectedActivity === key
            const hasImage = activityImages[key]
            const isLoadingImage = loadingImages[key]

            return (
              <div
                key={key}
                onClick={() => setSelectedActivity(key)}
                className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 overflow-visible ${
                  isSelected
                    ? "border-violet-500 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30 scale-[1.02]"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md"
                }`}
              >
                {/* Activity number badge */}
                <div className={`absolute -left-4 top-5 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 z-10 ${
                  isSelected 
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white scale-110"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 text-white group-hover:from-violet-600 group-hover:to-fuchsia-600"
                }`}>
                  {i + 1}
                </div>

                <div className="pl-6 space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    {isLoadingImage ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <ImageIcon size={32} className="mx-auto text-gray-400 animate-pulse" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Loading image...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={hasImage
                            ? activityImages[key]
                            : getPlaceholderImage(`${act.place_name} ${trip.destination}`, 960, 720)}
                          alt={act.place_name}
                          fill
                          sizes="(max-width: 640px) 100vw, 700px"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="font-bold text-xl text-white drop-shadow-lg">{act.place_name}</h4>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Header (only show if no image) */}
                  {!hasImage && !isLoadingImage && (
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {act.place_name}
                      </h4>
                      <ExternalLink 
                        size={16} 
                        className={`flex-shrink-0 transition-colors ${
                          isSelected 
                            ? "text-violet-500" 
                            : "text-gray-400 group-hover:text-violet-500"
                        }`}
                      />
                    </div>
                  )}

                  {/* Address */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="line-clamp-2">{act.place_address}</span>
                  </p>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-colors ${
                      isSelected 
                        ? "bg-white/80 dark:bg-slate-900/50" 
                        : "bg-gray-50 dark:bg-slate-900/50"
                    }`}>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Ticket size={13} className="text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                        {act.ticket_pricing}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-colors ${
                      isSelected 
                        ? "bg-white/80 dark:bg-slate-900/50" 
                        : "bg-gray-50 dark:bg-slate-900/50"
                    }`}>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Clock size={13} className="text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                        {act.time_travel_each_location}
                      </span>
                    </div>
                  </div>

                  {/* Best time badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                    <span>🕐</span>
                    <span>Best: {act.best_time_to_visit}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ),
    })) || []

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* ================= TRIP HEADER ================= */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200 to-fuchsia-200 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-full blur-3xl -z-0 opacity-50" />
          
          <div className="relative z-10 space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
                <Sparkles size={12} />
                <span>Your Personalized Trip</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {trip.destination}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span>From {trip.origin}</span>
              </p>
            </div>

            {/* Trip details */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Calendar size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {trip.duration}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                  {trip.group_size}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                  {trip.budget}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HOTELS ================= */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-200 dark:shadow-pink-900/30">
              <Hotel size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recommended Hotels
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Handpicked accommodations for your stay
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {trip.hotels?.map((hotel: any, i: number) => {
              const hasImage = hotelImages[i]
              const isLoadingImage = loadingImages[`hotel-${i}`]

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredHotel(i)}
                  onMouseLeave={() => setHoveredHotel(null)}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 p-5">
                    {/* Hotel image */}
                    <div className="relative w-full sm:w-40 h-40 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                      {isLoadingImage ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <ImageIcon size={24} className="mx-auto text-gray-400 animate-pulse" />
                            <p className="text-xs text-gray-500">Loading...</p>
                          </div>
                        </div>
                      ) : hasImage ? (
                        <>
                          <Image
                            src={hotelImages[i]}
                            alt={hotel.hotel_name}
                            fill
                            sizes="(max-width: 640px) 100vw, 320px"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            priority={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                      ) : (
                        <>
                          <Image
                            src={getPlaceholderImage(`${hotel.hotel_name} ${trip.destination}`, 640, 480)}
                            alt={hotel.hotel_name}
                            fill
                            sizes="(max-width: 640px) 100vw, 320px"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            priority={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                      )}
                      
                      {/* Floating rating badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {hotel.rating}
                        </span>
                      </div>
                    </div>

                    {/* Hotel details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {hotel.hotel_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                          <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                          <span className="line-clamp-2">{hotel.hotel_address}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {hotel.price_per_night}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            / night
                          </span>
                        </div>

                        {/* View button */}
                        <button className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          hoveredHotel === i
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-300 dark:shadow-violet-900/50 scale-105"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= ITINERARY ================= */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
              <CalendarDays size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Day-by-Day Itinerary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your complete journey timeline
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <Timeline
              data={timelineData}
              title={`Itinerary for ${trip?.destination || "your trip"}`}
              description={`Duration ${trip?.duration || ""} • Group ${trip?.group_size || ""}`}
            />
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default MapTrip
