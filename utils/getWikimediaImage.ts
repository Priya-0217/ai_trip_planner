import { getPlaceholderImage } from "./placeholderImage"

export const getWikimediaImage = async (
  query: string
): Promise<string | null> => {
  // Force local placeholders when network is restricted
  if (process.env.NEXT_PUBLIC_IMAGE_MODE === "local") {
    return getPlaceholderImage(query, 960, 720)
  }
  try {
    /* 1️⃣ SEARCH FOR PAGE */
    const searchUrl =
      `https://en.wikipedia.org/w/api.php?` +
      `action=query` +
      `&list=search` +
      `&srsearch=${encodeURIComponent(query)}` +
      `&format=json` +
      `&origin=*`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    const title = searchData?.query?.search?.[0]?.title
    if (!title) return getPlaceholderImage(query, 960, 720)

    /* 2️⃣ GET PAGE IMAGE */
    const imageUrl =
      `https://en.wikipedia.org/w/api.php?` +
      `action=query` +
      `&titles=${encodeURIComponent(title)}` +
      `&prop=pageimages` +
      `&pithumbsize=800` +
      `&format=json` +
      `&origin=*`

    const imageRes = await fetch(imageUrl)
    const imageData = await imageRes.json()

    const pages = imageData?.query?.pages
    const page = pages && Object.values(pages)[0] as { thumbnail?: { source?: string } }
    const src = page?.thumbnail?.source
    if (!src) return getPlaceholderImage(query, 960, 720)
    const fixed = src.replace(/\)+$/, "")
    try {
      const u = new URL(fixed)
      return u.toString()
    } catch {
      return getPlaceholderImage(query, 960, 720)
    }
  } catch (err) {
    console.error("Wikimedia error:", err)
    return getPlaceholderImage(query, 960, 720)
  }
}
