import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({
        message: "Banco de dados inicializado com sucesso!",
        status: "success",
      })
    } else {
      return NextResponse.json(
        {
          message: "Erro ao inicializar banco de dados",
          status: "error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro na inicialização:", error)
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        status: "error",
      },
      { status: 500 },
    )
  }
}
