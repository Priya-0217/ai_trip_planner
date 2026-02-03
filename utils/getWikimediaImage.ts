export const getWikimediaImage = async (
  query: string
): Promise<string | null> => {
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
    if (!title) return null

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
    const page: any = pages && Object.values(pages)[0]

    return page?.thumbnail?.source ?? null
  } catch (err) {
    console.error("Wikimedia error:", err)
    return null
  }
}
