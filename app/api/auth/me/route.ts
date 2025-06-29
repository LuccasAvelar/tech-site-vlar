import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

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
      return NextResponse.json({ error: "Sessão expirada" }, { status: 401 })
    }

    return NextResponse.json({
      id: sessionData.userId,
      name: sessionData.name,
      email: sessionData.email,
      isAdmin: sessionData.isAdmin,
    })
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
