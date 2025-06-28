import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Conteúdo padrão do site
const defaultContent = [
  {
    key: "site_title",
    value: "TechStore",
    type: "text",
    label: "Título do Site",
    description: "Nome principal do site",
  },
  {
    key: "site_subtitle",
    value: "Os melhores produtos de tecnologia para você",
    type: "text",
    label: "Subtítulo do Site",
    description: "Descrição principal do site",
  },
  {
    key: "hero_title",
    value: "Tecnologia de Ponta",
    type: "text",
    label: "Título da Seção Hero",
    description: "Título principal da página inicial",
  },
  {
    key: "hero_description",
    value: "Descubra os melhores produtos de tecnologia com preços incríveis e qualidade garantida.",
    type: "textarea",
    label: "Descrição da Seção Hero",
    description: "Texto descritivo da página inicial",
  },
  {
    key: "contact_title",
    value: "Entre em Contato",
    type: "text",
    label: "Título da Página de Contato",
    description: "Título da página de contato",
  },
  {
    key: "cart_empty_message",
    value: "Seu carrinho está vazio",
    type: "text",
    label: "Mensagem Carrinho Vazio",
    description: "Mensagem exibida quando o carrinho está vazio",
  },
]

export async function GET() {
  try {
    // Verificar se a tabela existe, se não, criar
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        label VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Buscar conteúdo existente
    const existingContent = await sql`SELECT * FROM site_content ORDER BY key`

    // Se não há conteúdo, inserir o padrão
    if (existingContent.length === 0) {
      for (const item of defaultContent) {
        await sql`
          INSERT INTO site_content (key, value, type, label, description)
          VALUES (${item.key}, ${item.value}, ${item.type}, ${item.label}, ${item.description})
        `
      }

      // Buscar novamente após inserir
      const newContent = await sql`SELECT * FROM site_content ORDER BY key`
      return NextResponse.json(newContent)
    }

    return NextResponse.json(existingContent)
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json()

    await sql`
      UPDATE site_content 
      SET value = ${value}, updated_at = CURRENT_TIMESTAMP
      WHERE key = ${key}
    `

    return NextResponse.json({ message: "Conteúdo atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
