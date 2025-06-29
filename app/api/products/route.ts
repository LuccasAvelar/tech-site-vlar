import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT id, name, description, price, image, category, stock, sku, is_active
      FROM products 
      WHERE is_active = TRUE
    `
    const params: any[] = []

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const products = await sql(query, params)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category, stock, sku, image } = await request.json()

    const result = await sql`
      INSERT INTO products (name, description, price, category, stock, sku, image)
      VALUES (${name}, ${description}, ${price}, ${category}, ${stock}, ${sku}, ${image})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
