import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Buscar admin no banco
    const admins = await sql`
      SELECT * FROM users WHERE email = ${email} AND is_admin = true
    `

    if (admins.length === 0) {
      return NextResponse.json({ error: "Admin não encontrado" }, { status: 401 })
    }

    const admin = admins[0]

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    )

    // Configurar cookie
    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        isAdmin: true,
      },
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 horas
    })

    return response
  } catch (error) {
    console.error("Erro no login admin:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
