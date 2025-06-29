import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

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
        id, 
        name, 
        description, 
        price, 
        image_url, 
        category, 
        stock, 
        sku
      FROM products 
      WHERE active = true 
        AND (
          LOWER(name) LIKE ${searchTerm} 
          OR LOWER(description) LIKE ${searchTerm}
          OR LOWER(sku) LIKE ${searchTerm}
          OR LOWER(category) LIKE ${searchTerm}
        )
      ORDER BY 
        CASE 
          WHEN LOWER(name) LIKE ${searchTerm} THEN 1
          WHEN LOWER(sku) LIKE ${searchTerm} THEN 2
          ELSE 3
        END
      LIMIT 10
    `

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro na busca:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
