import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso" })

  // Remover cookie de sessão
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })

  return response
}
