import { NextRequest, NextResponse } from "next/server"

const NCP_KEY_ID = process.env.NCP_APIGW_API_KEY_ID
const NCP_KEY = process.env.NCP_APIGW_API_KEY
const GEOCODE_URL = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode"

export async function POST(request: NextRequest) {
  const { query } = (await request.json()) as { query?: string }

  if (!query) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 }
    )
  }

  if (!NCP_KEY_ID || !NCP_KEY) {
    return NextResponse.json(
      { error: "Geocoding API keys not configured" },
      { status: 500 }
    )
  }

  const url = `${GEOCODE_URL}?query=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      "x-ncp-apigw-api-key-id": NCP_KEY_ID,
      "x-ncp-apigw-api-key": NCP_KEY,
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "Geocoding request failed" },
      { status: res.status }
    )
  }

  const data = await res.json()
  const address = data.addresses?.[0]

  if (!address) {
    return NextResponse.json(
      { error: "주소를 찾을 수 없습니다" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    lat: parseFloat(address.y),
    lng: parseFloat(address.x),
  })
}
