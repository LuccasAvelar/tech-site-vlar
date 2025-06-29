import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Função para inicializar o banco
export async function initDatabase() {
  try {
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
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Adicionar coluna needs_password_change se não existir
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS needs_password_change BOOLEAN DEFAULT FALSE
    `

    // Criar tabela de produtos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        sku VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Inserir usuário admin padrão
    const adminExists = await sql`
      SELECT id FROM users WHERE email = 'luccasavelar@gmail.com'
    `

    if (adminExists.length === 0) {
      const bcrypt = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash("luccasavelar@gmail.com", 10)

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
      const bcrypt = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash("admin123#", 10)

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
          name: "Vape Pod Descartável 2500 Puffs",
          description: "Vaporizador descartável com 2500 puffs, sabor frutas vermelhas",
          price: 29.9,
          category: "vaporizadores",
          stock: 45,
          sku: "VP001",
        },
        {
          name: "Líquido Nic Salt 30ml",
          description: "Líquido para vape com nicotina salt, diversos sabores disponíveis",
          price: 19.9,
          category: "liquidos",
          stock: 32,
          sku: "LQ001",
        },
        {
          name: "Coil Reposição 0.8ohm",
          description: "Resistência de reposição para vaporizadores, 0.8ohm",
          price: 12.9,
          category: "reposicao",
          stock: 78,
          sku: "CR001",
        },
        {
          name: "SSD 480GB SATA",
          description: "SSD de alta velocidade para melhor performance do seu PC",
          price: 189.9,
          category: "informatica",
          stock: 15,
          sku: "SSD001",
        },
        {
          name: "Memória RAM 8GB DDR4",
          description: "Memória RAM DDR4 8GB para upgrade do seu computador",
          price: 159.9,
          category: "informatica",
          stock: 23,
          sku: "RAM001",
        },
        {
          name: "Carregador USB-C",
          description: "Carregador rápido USB-C compatível com diversos dispositivos",
          price: 24.9,
          category: "eletronicos",
          stock: 67,
          sku: "CHG001",
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (name, description, price, category, stock, sku)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.stock}, ${product.sku})
        `
      }
    }

    console.log("✅ Banco de dados inicializado com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao inicializar banco:", error)
    return false
  }
}
