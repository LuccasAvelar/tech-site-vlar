import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco
    const users = await sql`
      SELECT id, name, email, password, is_admin, needs_password_change
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Criar resposta com cookie de sessão
    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        needs_password_change: user.needs_password_change,
      },
    })

    // Definir cookie de sessão
    response.cookies.set(
      "session",
      JSON.stringify({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      },
    )

    return response
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
