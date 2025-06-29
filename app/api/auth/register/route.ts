import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, birthDate } = await request.json()

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar novo usuário
    const result = await sql`
      INSERT INTO users (name, email, password, phone, birth_date, is_admin)
      VALUES (${name}, ${email}, ${hashedPassword}, ${phone || null}, ${birthDate || null}, FALSE)
      RETURNING id, name, email, phone, birth_date, is_admin, created_at
    `

    const newUser = result[0]

    // Criar sessão simples com cookie
    const sessionData = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.is_admin,
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

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        birthDate: newUser.birth_date,
        isAdmin: newUser.is_admin,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor. Tente novamente.",
      },
      { status: 500 },
    )
  }
}
