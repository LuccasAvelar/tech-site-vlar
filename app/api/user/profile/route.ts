import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const { name, phone, address, city, state, zip_code, currentPassword, newPassword } = await request.json()

    // Se está tentando alterar a senha, verificar a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Senha atual é obrigatória para alterar a senha" }, { status: 400 })
      }

      const users = await sql`
        SELECT password FROM users WHERE id = ${session.userId}
      `

      if (users.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password)

      if (!isValidPassword) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
      }

      // Hash da nova senha
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)

      // Atualizar com nova senha
      await sql`
        UPDATE users 
        SET 
          name = ${name},
          phone = ${phone || null},
          address = ${address || null},
          city = ${city || null},
          state = ${state || null},
          zip_code = ${zip_code || null},
          password = ${hashedNewPassword},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${session.userId}
      `
    } else {
      // Atualizar apenas dados pessoais
      await sql`
        UPDATE users 
        SET 
          name = ${name},
          phone = ${phone || null},
          address = ${address || null},
          city = ${city || null},
          state = ${state || null},
          zip_code = ${zip_code || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${session.userId}
      `
    }

    return NextResponse.json({ message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
