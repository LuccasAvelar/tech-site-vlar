import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, birthDate } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    // Verificar se o email já existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${emailLower}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Inserir novo usuário
    const newUsers = await sql`
      INSERT INTO users (name, email, password, phone, birth_date, is_admin)
      VALUES (${name}, ${emailLower}, ${hashedPassword}, ${phone || null}, ${birthDate || null}, FALSE)
      RETURNING id, name, email, phone, birth_date, is_admin
    `

    const newUser = newUsers[0]

    // Criar sessão automaticamente
    const sessionData = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.is_admin,
      loginTime: Date.now(),
    }

    const cookieStore = cookies()
    cookieStore.set("vlar-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.is_admin,
        phone: newUser.phone,
      },
    })
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
