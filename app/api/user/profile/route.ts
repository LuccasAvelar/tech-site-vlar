import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("vlar-session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)

    const users = await sql`
      SELECT id, name, email, phone, birth_date, avatar, address, city, state, zip_code, created_at
      FROM users 
      WHERE id = ${sessionData.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthDate: user.birth_date,
        avatar: user.avatar,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zip_code,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("vlar-session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const { name, phone, birthDate, address, city, state, zipCode, currentPassword, newPassword } = await request.json()

    // Se está tentando alterar a senha, verificar a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Senha atual é obrigatória para alterar a senha" }, { status: 400 })
      }

      const users = await sql`
        SELECT password FROM users WHERE id = ${sessionData.userId}
      `

      if (users.length === 0) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12)

      await sql`
        UPDATE users 
        SET 
          name = ${name},
          phone = ${phone || null},
          birth_date = ${birthDate || null},
          address = ${address || null},
          city = ${city || null},
          state = ${state || null},
          zip_code = ${zipCode || null},
          password = ${hashedNewPassword},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${sessionData.userId}
      `
    } else {
      await sql`
        UPDATE users 
        SET 
          name = ${name},
          phone = ${phone || null},
          birth_date = ${birthDate || null},
          address = ${address || null},
          city = ${city || null},
          state = ${state || null},
          zip_code = ${zipCode || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${sessionData.userId}
      `
    }

    return NextResponse.json({ message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
