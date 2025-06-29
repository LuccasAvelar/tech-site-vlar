import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco
    const users = await sql`
      SELECT id, name, email, password, phone, birth_date, is_admin, created_at
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    // Criar sessão
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.is_admin,
      loginTime: Date.now(),
    }

    const cookieStore = cookies()
    cookieStore.set("vlar-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: user.birth_date,
      isAdmin: user.is_admin,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor. Tente novamente.",
      },
      { status: 500 },
    )
  }
}
