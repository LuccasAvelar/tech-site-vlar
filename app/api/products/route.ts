import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "50"
    const category = searchParams.get("category")

    let query = sql`
      SELECT id, name, description, price, image, category, stock, sku, created_at
      FROM products
    `

    if (category) {
      query = sql`
        SELECT id, name, description, price, image, category, stock, sku, created_at
        FROM products
        WHERE category = ${category}
      `
    }

    const products = await query

    // Limitar resultados
    const limitedProducts = products.slice(0, Number.parseInt(limit))

    return NextResponse.json(limitedProducts)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, image, category, stock, sku } = await request.json()

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Nome, preço e categoria são obrigatórios" }, { status: 400 })
    }

    const newProducts = await sql`
      INSERT INTO products (name, description, price, image, category, stock, sku)
      VALUES (${name}, ${description || null}, ${price}, ${image || null}, ${category}, ${stock || 0}, ${sku || null})
      RETURNING id, name, description, price, image, category, stock, sku, created_at
    `

    return NextResponse.json(newProducts[0])
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
