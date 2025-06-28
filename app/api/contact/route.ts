import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, surname, email, whatsapp, message } = await request.json()

    // Salvar no banco
    await sql`
      INSERT INTO contact_messages (name, surname, email, whatsapp, message)
      VALUES (${name}, ${surname}, ${email}, ${whatsapp || null}, ${message})
    `

    // Enviar email (se configurado)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendContactNotification({ name, surname, email, whatsapp, message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar contato:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

async function sendContactNotification(data: any) {
  try {
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const emailContent = `
      📧 NOVA MENSAGEM DE CONTATO - VLAR
      
      👤 Nome: ${data.name} ${data.surname}
      📧 Email: ${data.email}
      📱 WhatsApp: ${data.whatsapp || "Não informado"}
      
      💬 Mensagem:
      ${data.message}
      
      ⏰ Data: ${new Date().toLocaleString("pt-BR")}
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "vlartech@gmail.com",
      subject: "🔔 Nova Mensagem de Contato - Vlar",
      text: emailContent,
    })

    console.log("✅ Email de contato enviado!")
  } catch (error) {
    console.error("❌ Erro ao enviar email de contato:", error)
  }
}
