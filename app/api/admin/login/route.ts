import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Verificar credenciais admin (você pode mudar estas credenciais)
    if (email === "vlartech@gmail.com" && password === "Lc157849") {
      // Criar sessão admin
      const cookieStore = cookies()
      cookieStore.set("admin-session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 horas
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Erro no login admin:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
