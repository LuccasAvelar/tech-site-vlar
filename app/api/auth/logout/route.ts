import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("vlar-session")

    return NextResponse.json({ message: "Logout realizado com sucesso" })
  } catch (error) {
    console.error("Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
