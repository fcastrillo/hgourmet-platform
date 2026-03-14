import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const headers = new Headers(request.headers);

  const forwardedHost = headers.get("x-forwarded-host");
  const forwardedProto = headers.get("x-forwarded-proto");
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  const baseUrl =
    configuredSiteUrl ||
    (forwardedHost ? `${forwardedProto ?? "https"}://${forwardedHost}` : origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${baseUrl}/admin`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth`);
}
