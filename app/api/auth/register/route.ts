import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, birthDate } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    // Verificar se o email já existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Inserir novo usuário
    const newUsers = await sql`
      INSERT INTO users (name, email, password, phone, birth_date)
      VALUES (${name}, ${email.toLowerCase()}, ${hashedPassword}, ${phone || null}, ${birthDate || null})
      RETURNING id, name, email, is_admin
    `

    const newUser = newUsers[0]

    // Criar resposta com cookie de sessão
    const response = NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_admin: newUser.is_admin,
      },
    })

    // Definir cookie de sessão
    response.cookies.set(
      "session",
      JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        isAdmin: newUser.is_admin,
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
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
