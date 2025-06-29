import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)

    // Buscar dados atualizados do usuário
    const users = await sql`
      SELECT id, name, email, phone, birth_date, address, city, state, zip_code, is_admin, avatar
      FROM users 
      WHERE id = ${session.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birth_date: user.birth_date,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        is_admin: user.is_admin,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
