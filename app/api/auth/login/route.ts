import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    console.log("Tentativa de login para:", email)

    // Buscar usuário no banco
    const users = await sql`
      SELECT id, name, email, password, is_admin, phone, avatar, address, city, state, zip_code
      FROM users 
      WHERE email = ${email.toLowerCase().trim()}
    `

    console.log("Usuários encontrados:", users.length)

    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]
    console.log("Verificando senha para usuário:", user.email)

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("Senha válida:", isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    // Criar sessão
    const sessionData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
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

    console.log("Login realizado com sucesso para:", user.email)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zip_code,
      },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
