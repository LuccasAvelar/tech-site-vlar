import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const banners = await sql`
      SELECT id, title, image_url, link_url, active, sort_order, created_at
      FROM banners 
      WHERE active = true 
      ORDER BY sort_order ASC, created_at DESC
    `

    return NextResponse.json({ banners })
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
