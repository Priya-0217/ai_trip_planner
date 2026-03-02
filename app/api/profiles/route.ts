import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type CacheEntry = { expires: number; data: unknown }
const cache = new Map<string, CacheEntry>()
const MAX_ENTRIES = 300

function get(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function set(key: string, data: unknown, ttl: number) {
  cache.set(key, { expires: Date.now() + ttl, data })
  if (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value
    if (typeof oldest === "string") {
      cache.delete(oldest)
    }
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const username = searchParams.get("username")
  const page = Number(searchParams.get("page") || "1")
  const limit = Number(searchParams.get("limit") || "20")
  const useMv = searchParams.get("use") === "mv"

  const key = JSON.stringify({ id, username, page, limit })
  const cached = get(key)
  if (cached) {
    const etag = `W/"${JSON.stringify(cached).length}"`
    const inm = req.headers.get("if-none-match")
    if (inm && inm === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      })
    }
    return NextResponse.json(cached, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    })
  }

  let result: unknown
  let ttl = 60_000
  if (id) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,username,full_name,avatar_url,is_public,created_at,updated_at")
      .eq("id", id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    result = data
    ttl = 60_000
  } else if (username) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,username,full_name,avatar_url,is_public,created_at,updated_at")
      .eq("username", username)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    result = data
    ttl = 60_000
  } else {
    const offset = (page - 1) * limit
    let data, error, count
    if (useMv) {
      const resp = await supabase
        .from("public_profiles_mv")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
      data = resp.data
      error = resp.error
      count = resp.count
      if (error) {
        const resp2 = await supabase
          .from("public_profiles")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
        data = resp2.data
        error = resp2.error
        count = resp2.count
      }
    } else {
      const resp = await supabase
        .from("public_profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
      data = resp.data
      error = resp.error
      count = resp.count
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    result = { data, page, limit, total: count ?? null }
    ttl = 120_000
  }

  set(key, result, ttl)
  const etag = `W/"${JSON.stringify(result).length}"`
  return NextResponse.json(result, {
    headers: {
      ETag: etag,
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  })
}
