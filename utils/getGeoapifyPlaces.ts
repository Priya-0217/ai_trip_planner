const GEO_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

export const getGeoapifyPlaces = async ({
  city,
  category,
  limit = 10
}: {
  city: string
  category: string
  limit?: number
}) => {
  const url =
    `https://api.geoapify.com/v2/places?` +
    `text=${encodeURIComponent(city)}` +
    `&categories=${category}` +
    `&limit=${limit}` +
    `&apiKey=${GEO_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Geoapify error")

  return res.json()
}
