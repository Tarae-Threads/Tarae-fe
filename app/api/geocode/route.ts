import { NextRequest, NextResponse } from "next/server";

const NCP_KEY_ID = process.env.NCP_APIGW_API_KEY_ID;
const NCP_KEY = process.env.NCP_APIGW_API_KEY;
const GEOCODE_URL = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";

// 쿼리 제약
const MAX_QUERY_LENGTH = 200;

// 동일 프로세스 메모리 기반 레이트리밋 (IP당 60초에 30회)
// 서버리스 환경에서는 인스턴스별로 독립 — 분산 레이트리밋 필요 시 upstash 등 고려
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_MAX) {
    rateBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return false;
}

// 허용 Origin — 배포/개발 도메인
const ALLOWED_ORIGINS = new Set([
  "https://tarae.vercel.app",
  "https://taraethreads.com",
  "https://www.taraethreads.com",
  "http://localhost:3000",
  "http://localhost:3848",
]);

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // 같은 오리진 fetch는 Origin 헤더가 없을 수 있음 (일부 브라우저)
  return ALLOWED_ORIGINS.has(origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    return NextResponse.json({ error: "forbidden origin" }, { status: 403 });
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "too many requests" },
      { status: 429 },
    );
  }

  let body: { query?: unknown };
  try {
    body = (await request.json()) as { query?: unknown };
  } catch {
    return NextResponse.json(
      { error: "invalid body" },
      { status: 400 },
    );
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json(
      { error: "query is required" },
      { status: 400 },
    );
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "query too long" },
      { status: 400 },
    );
  }
  // 프로토콜 주입 방지 — 주소는 :// 를 포함하지 않는다
  if (query.includes("://")) {
    return NextResponse.json(
      { error: "invalid query" },
      { status: 400 },
    );
  }

  if (!NCP_KEY_ID || !NCP_KEY) {
    return NextResponse.json(
      { error: "geocoding unavailable" },
      { status: 500 },
    );
  }

  const url = `${GEOCODE_URL}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "x-ncp-apigw-api-key-id": NCP_KEY_ID,
      "x-ncp-apigw-api-key": NCP_KEY,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "geocoding request failed" },
      { status: res.status },
    );
  }

  const data = (await res.json()) as {
    addresses?: Array<{ x?: string; y?: string }>;
  };
  const address = data.addresses?.[0];
  if (!address || !address.x || !address.y) {
    return NextResponse.json(
      { error: "주소를 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    lat: parseFloat(address.y),
    lng: parseFloat(address.x),
  });
}
