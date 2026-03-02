export const getWikimediaImage = async (
  query: string
): Promise<string | null> => {
  try {
    const buildUnsplash = (q: string) =>
      `https://source.unsplash.com/960x720/?${encodeURIComponent(q)},travel,landmark`;
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
    if (!title) return buildUnsplash(query)

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
    if (!src) return buildUnsplash(query)
    const fixed = src.replace(/\)+$/, "")
    try {
      const u = new URL(fixed)
      return u.toString()
    } catch {
      return buildUnsplash(query)
    }
  } catch (err) {
    console.error("Wikimedia error:", err)
    return `https://source.unsplash.com/960x720/?${encodeURIComponent(query)},travel,landmark`
  }
}
