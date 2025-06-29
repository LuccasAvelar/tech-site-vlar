import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("vlar-session")

    if (!sessionCookie) {
      return NextResponse.json({ user: null })
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // Verificar se a sessão não expirou (7 dias)
    const now = Date.now()
    const sessionAge = now - sessionData.loginTime
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 dias em ms

    if (sessionAge > maxAge) {
      // Sessão expirada, limpar cookie
      cookieStore.delete("vlar-session")
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: sessionData.userId,
        name: sessionData.name,
        email: sessionData.email,
        isAdmin: sessionData.isAdmin,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return NextResponse.json({ user: null })
  }
}
