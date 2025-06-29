import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

// Limpar a URL do banco removendo prefixos desnecessários
function cleanDatabaseUrl(url: string): string {
  if (!url) return ""

  // Remove prefixos como 'psql ' se existirem
  const cleaned = url.replace(/^psql\s+['"]?/, "").replace(/['"]$/, "")

  return cleaned
}

const sql = neon(cleanDatabaseUrl(process.env.DATABASE_URL || ""))

export { sql }

// Função para inicializar o banco se necessário
export async function initializeDatabase() {
  try {
    // Verificar se as tabelas existem
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `

    if (tables.length === 0) {
      console.log("Banco não inicializado, criando estrutura...")

      // Criar tabela de usuários
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          birth_date DATE,
          avatar TEXT,
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(2),
          zip_code VARCHAR(10),
          is_admin BOOLEAN DEFAULT FALSE,
          needs_password_change BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de produtos
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          image_url TEXT,
          category VARCHAR(100),
          stock INTEGER DEFAULT 0,
          sku VARCHAR(100),
          active BOOLEAN DEFAULT TRUE,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de categorias
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de pedidos
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          total DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50),
          installments INTEGER DEFAULT 1,
          address TEXT,
          coupon_code VARCHAR(50),
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de itens do pedido
      await sql`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de banners
      await sql`
        CREATE TABLE IF NOT EXISTS banners (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          image_url TEXT NOT NULL,
          link_url TEXT,
          active BOOLEAN DEFAULT TRUE,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela de conteúdo do site
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

      // Inserir categorias padrão
      const categories = [
        { name: "Vaporizadores", slug: "vaporizadores" },
        { name: "Líquidos", slug: "liquidos" },
        { name: "Reposição", slug: "reposicao" },
        { name: "Eletrônicos", slug: "eletronicos" },
        { name: "Informática", slug: "informatica" },
      ]

      for (const category of categories) {
        await sql`
          INSERT INTO categories (name, slug)
          VALUES (${category.name}, ${category.slug})
          ON CONFLICT (slug) DO NOTHING
        `
      }

      // Inserir usuário admin padrão
      const adminExists = await sql`
        SELECT id FROM users WHERE email = 'luccasavelar@gmail.com'
      `

      if (adminExists.length === 0) {
        const hashedPassword = await bcrypt.hash("luccasavelar@gmail.com", 12)

        await sql`
          INSERT INTO users (name, email, password, phone, birth_date, is_admin, needs_password_change)
          VALUES (
            'Administrador',
            'luccasavelar@gmail.com',
            ${hashedPassword},
            '(11) 99999-9999',
            '1990-01-01',
            TRUE,
            TRUE
          )
        `
      }

      // Inserir segundo usuário admin
      const admin2Exists = await sql`
        SELECT id FROM users WHERE email = 'contato@vlar.com'
      `

      if (admin2Exists.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123#", 12)

        await sql`
          INSERT INTO users (name, email, password, phone, is_admin)
          VALUES (
            'Admin Vlar',
            'contato@vlar.com',
            ${hashedPassword},
            '(33) 99834-3132',
            TRUE
          )
        `
      }

      // Inserir produtos de exemplo
      const productsExist = await sql`SELECT id FROM products LIMIT 1`

      if (productsExist.length === 0) {
        const sampleProducts = [
          {
            name: "Vape Pod Descartável 2500 Puffs - Frutas Vermelhas",
            description: "Vaporizador descartável com 2500 puffs, sabor frutas vermelhas. Prático e saboroso.",
            price: 29.9,
            category: "vaporizadores",
            stock: 45,
            sku: "VP001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
          },
          {
            name: "Líquido Nic Salt 30ml - Menta Gelada",
            description: "Líquido para vape com nicotina salt, sabor menta gelada refrescante.",
            price: 19.9,
            category: "liquidos",
            stock: 32,
            sku: "LQ001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
          },
          {
            name: "Coil Reposição 0.8ohm - Pack 5 unidades",
            description: "Resistência de reposição para vaporizadores, 0.8ohm. Pack com 5 unidades.",
            price: 12.9,
            category: "reposicao",
            stock: 78,
            sku: "CR001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: false,
          },
          {
            name: "SSD 480GB SATA Kingston",
            description: "SSD de alta velocidade Kingston 480GB SATA para melhor performance do seu PC.",
            price: 189.9,
            category: "informatica",
            stock: 15,
            sku: "SSD001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
          },
          {
            name: "Memória RAM 8GB DDR4 2666MHz",
            description: "Memória RAM DDR4 8GB 2666MHz para upgrade do seu computador.",
            price: 159.9,
            category: "informatica",
            stock: 23,
            sku: "RAM001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: false,
          },
          {
            name: "Carregador USB-C 20W Fast Charge",
            description: "Carregador rápido USB-C 20W compatível com diversos dispositivos.",
            price: 24.9,
            category: "eletronicos",
            stock: 67,
            sku: "CHG001",
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
          },
        ]

        for (const product of sampleProducts) {
          await sql`
            INSERT INTO products (name, description, price, category, stock, sku, image_url, featured)
            VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.stock}, ${product.sku}, ${product.image_url}, ${product.featured})
          `
        }
      }

      // Inserir banners padrão
      const bannersExist = await sql`SELECT id FROM banners LIMIT 1`

      if (bannersExist.length === 0) {
        const defaultBanners = [
          {
            title: "Bem-vindo à Vlar",
            image_url: "/placeholder.svg?height=400&width=1200",
            link_url: "/",
            order_index: 1,
          },
          {
            title: "Promoção Vaporizadores",
            image_url: "/placeholder.svg?height=400&width=1200",
            link_url: "/categoria/vaporizadores",
            order_index: 2,
          },
          {
            title: "Novos Líquidos",
            image_url: "/placeholder.svg?height=400&width=1200",
            link_url: "/categoria/liquidos",
            order_index: 3,
          },
        ]

        for (const banner of defaultBanners) {
          await sql`
            INSERT INTO banners (title, image_url, link_url, order_index)
            VALUES (${banner.title}, ${banner.image_url}, ${banner.link_url}, ${banner.order_index})
          `
        }
      }
    }

    console.log("✅ Banco de dados inicializado com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao inicializar banco:", error)
    return false
  }
}
