import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("vlar-session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // Verificar se a sessão não expirou (7 dias)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - sessionData.loginTime > sevenDaysInMs) {
      // Sessão expirada, remover cookie
      cookieStore.delete("vlar-session")
      return NextResponse.json({ error: "Sessão expirada" }, { status: 401 })
    }

    // Buscar dados atualizados do usuário
    const users = await sql`
      SELECT id, name, email, phone, birth_date, is_admin, created_at
      FROM users 
      WHERE id = ${sessionData.userId}
    `

    if (users.length === 0) {
      cookieStore.delete("vlar-session")
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    const user = users[0]

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: user.birth_date,
      isAdmin: user.is_admin,
    })
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
