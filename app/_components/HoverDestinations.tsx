"use client"

import { HoverExpand_001 } from "@/components/ui/skiper-ui/skiper52"

const destinations = [
  { src: "/destination/image1.jpg", alt: "Tropical Escape", code: "eastern" },
  { src: "/destination/image2.jpg", alt: "Romantic Getaway", code: "IMG-02" },
  { src: "/destination/image3.jpg", alt: "City Lights", code: "IMG-03" },
  { src: "/destination/image4.jpg", alt: "Luxury Retreat", code: "IMG-04" },
  { src: "/destination/image5.jpg", alt: "Adventure Mode", code: "IMG-05" },
  { src: "/destination/image6.jpg", alt: "Hidden Paradise", code: "IMG-06" },
  { src: "/destination/image7.jpg", alt: "Weekend Trip", code: "IMG-07" },
  { src: "/destination/image8.jpg", alt: "Nature Calm", code: "IMG-08" },
]

const HoverDestinations = () => {
  return (
    <section className="mt-28 space-y-6">
      <h2 className="text-center text-2xl font-semibold">
        Popular destinations people love
      </h2>

      <p className="text-center text-muted-foreground max-w-xl mx-auto">
        Hover to explore places — your next adventure might be one click away.
      </p>

      <HoverExpand_001
        images={destinations}
        className="max-w-6xl mx-auto"
      />
    </section>
  )
}

export default HoverDestinations
