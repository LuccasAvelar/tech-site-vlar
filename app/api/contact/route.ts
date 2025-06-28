import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { nome, sobrenome, email, whatsapp, problema } = await request.json()

    // Configurar o transporter do nodemailer
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Configurar o email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "luccasavelar@gmail.com", // Seu email
      subject: `Novo contato de ${nome} ${sobrenome}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Problema/Dúvida:</strong></p>
        <p>${problema}</p>
        <hr>
        <p><em>Mensagem enviada através do site TechStore</em></p>
      `,
    }

    // Enviar o email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "Email enviado com sucesso!" })
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 })
  }
}
