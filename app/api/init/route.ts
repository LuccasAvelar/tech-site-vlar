import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Criar tabelas se não existirem
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        birth_date DATE,
        address TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        parent_id INTEGER REFERENCES categories(id),
        image_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        category VARCHAR(255),
        category_id INTEGER REFERENCES categories(id),
        stock INTEGER DEFAULT 0,
        sku VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        weight DECIMAL(8,2),
        dimensions VARCHAR(100),
        brand VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        products JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        installments VARCHAR(10),
        address TEXT NOT NULL,
        coupon_code VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        tracking_code VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        image_url TEXT NOT NULL,
        link_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(20),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

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

    // Verificar se já existe usuário admin
    const adminExists = await sql`SELECT id FROM users WHERE email = 'contato@vlar.com' LIMIT 1`

    if (adminExists.length === 0) {
      // Criar usuário admin
      await sql`
        INSERT INTO users (name, email, password, is_admin)
        VALUES ('Admin Vlar', 'contato@vlar.com', '$2b$10$8K1p/a0drtIEO.xJ3/ialu.Oqgj4Edg.7Y/SuK6LI.JJ0T/jbPXyy', true)
      `
    }

    // Verificar se já existem produtos
    const productsExist = await sql`SELECT id FROM products LIMIT 1`

    if (productsExist.length === 0) {
      // Inserir produtos de exemplo
      const sampleProducts = [
        {
          name: "Vaporizador Vlar Pro",
          description: "Vaporizador de alta qualidade com controle de temperatura preciso",
          price: 299.99,
          image_url: "/placeholder.svg?height=300&width=300",
          category: "Vaporizadores",
          stock: 15,
          sku: "VLAR-PRO-001",
          featured: true,
        },
        {
          name: "Líquido Premium Mint",
          description: "Líquido premium sabor menta refrescante",
          price: 29.99,
          image_url: "/placeholder.svg?height=300&width=300",
          category: "Líquidos",
          stock: 50,
          sku: "LIQ-MINT-001",
          featured: true,
        },
        {
          name: "Carregador USB-C",
          description: "Carregador rápido USB-C para vaporizadores",
          price: 39.99,
          image_url: "/placeholder.svg?height=300&width=300",
          category: "Acessórios",
          stock: 25,
          sku: "CHAR-USBC-001",
          featured: false,
        },
        {
          name: "Kit Iniciante Vlar",
          description: "Kit completo para iniciantes com vaporizador e líquidos",
          price: 199.99,
          image_url: "/placeholder.svg?height=300&width=300",
          category: "Kits",
          stock: 10,
          sku: "KIT-INIT-001",
          featured: true,
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (name, description, price, image_url, category, stock, sku, featured)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.image_url}, ${product.category}, ${product.stock}, ${product.sku}, ${product.featured})
        `
      }
    }

    // Verificar se já existem banners
    const bannersExist = await sql`SELECT id FROM banners LIMIT 1`

    if (bannersExist.length === 0) {
      // Inserir banners de exemplo
      const sampleBanners = [
        {
          title: "Promoção Vaporizadores",
          image_url: "/placeholder.svg?height=400&width=800",
          link_url: "/categoria/vaporizadores",
          sort_order: 1,
        },
        {
          title: "Novos Líquidos",
          image_url: "/placeholder.svg?height=400&width=800",
          link_url: "/categoria/liquidos",
          sort_order: 2,
        },
      ]

      for (const banner of sampleBanners) {
        await sql`
          INSERT INTO banners (title, image_url, link_url, sort_order)
          VALUES (${banner.title}, ${banner.image_url}, ${banner.link_url}, ${banner.sort_order})
        `
      }
    }

    return NextResponse.json({ message: "Banco de dados inicializado com sucesso!" })
  } catch (error) {
    console.error("Erro ao inicializar banco:", error)
    return NextResponse.json({ error: "Erro ao inicializar banco de dados" }, { status: 500 })
  }
}
