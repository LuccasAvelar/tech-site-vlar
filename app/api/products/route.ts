import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let query = sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        image_url, 
        category, 
        stock, 
        sku, 
        featured,
        active
      FROM products 
      WHERE active = true
    `

    if (category) {
      query = sql`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image_url, 
          category, 
          stock, 
          sku, 
          featured,
          active
        FROM products 
        WHERE active = true AND category = ${category}
      `
    }

    if (featured === "true") {
      query = sql`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image_url, 
          category, 
          stock, 
          sku, 
          featured,
          active
        FROM products 
        WHERE active = true AND featured = true
      `
    }

    if (limit) {
      const products = await query
      const limitedProducts = products.slice(0, Number.parseInt(limit))
      return NextResponse.json({ products: limitedProducts })
    }

    const products = await query

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
