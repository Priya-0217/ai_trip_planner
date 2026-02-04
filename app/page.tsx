import { Suspense } from 'react'
import Hero from './_components/hero'
import HoverDestinations from './_components/HoverDestinations'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
      </Suspense>
      <HoverDestinations />
    </div>
  )
}

export default page