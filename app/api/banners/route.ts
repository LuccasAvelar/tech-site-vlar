import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const banners = await sql`
      SELECT id, title, image_url, link_url, active, order_index
      FROM banners 
      WHERE active = true 
      ORDER BY order_index ASC
    `

    return NextResponse.json({ banners })
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
    return NextResponse.json({ banners: [] })
  }
}
