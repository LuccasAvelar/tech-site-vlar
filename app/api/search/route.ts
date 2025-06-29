import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    const searchTerm = `%${query.toLowerCase()}%`

    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_url,
        p.sku,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
        p.active = true AND
        (LOWER(p.name) LIKE ${searchTerm} OR 
         LOWER(p.description) LIKE ${searchTerm} OR
         LOWER(p.sku) LIKE ${searchTerm})
      ORDER BY 
        CASE 
          WHEN LOWER(p.name) LIKE ${`${query.toLowerCase()}%`} THEN 1
          WHEN LOWER(p.name) LIKE ${searchTerm} THEN 2
          ELSE 3
        END,
        p.name
      LIMIT 10
    `

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro na busca:", error)
    return NextResponse.json({ products: [] })
  }
}
