–––– components/banner-carousel.tsx ––––
const BannerCarousel = () => {
  return <div>{/* Banner Carousel Content */}</div>
}

export default BannerCarousel
// allow named import
export { BannerCarousel }

–––– components/featured-products.tsx ––––
const FeaturedProducts = () => {
  return <div>{/* Featured Products Content */}</div>
}
export default FeaturedProducts;
export { FeaturedProducts }

–––– components/product-grid.tsx ––––
const ProductGrid = () => {
  return <div>{/* Product Grid Content */}</div>
}

export default ProductGrid;
export { ProductGrid }

–––– components/whatsapp-button.tsx ––––
const WhatsAppButton = () => {
  return <div>{/* WhatsApp Button Content */}</div>
}

export default WhatsAppButton;
export { WhatsAppButton }

–––– app/page.tsx ––––
import BannerCarousel from "@/components/banner-carousel"
import FeaturedProducts from "@/components/featured-products"
import ProductGrid from "@/components/product-grid"
import WhatsAppButton from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main>
      <BannerCarousel />
      <FeaturedProducts />
      <ProductGrid />
      <WhatsAppButton />
    </main>
  );
}

–––– app/api/auth/me/route.ts ––––
export const dynamic = "force-dynamic"

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const token = cookies().get("session")?.value

  if (!token) {
    return NextResponse.json(null)
  }

  const userResult = await sql`
    SELECT id, name, email, is_admin FROM users
    INNER JOIN sessions ON users.id = sessions.user_id
    WHERE sessions.session_token = ${token} AND sessions.expires > NOW()
  `

  if (userResult.length === 0) {
    return NextResponse.json(null)
  }

  const user = userResult[0]

  return NextResponse.json(user)
}

–––– lib/db.ts ––––
import { Kysely } from "kysely"
import { PlanetScaleDialect } from "kysely-planetscale"

interface UserTable {
  id: string
  name: string
  email: string
  password?: string
  is_admin: 0 | 1
  needs_password_change: 0 | 1
}

interface SessionTable {
  session_token: string
  user_id: string
  expires: Date
}

interface Database {
  users: UserTable
  sessions: SessionTable
}

export const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
})

export const sql = db.raw

async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255),
      is_admin BOOLEAN NOT NULL DEFAULT FALSE
    )
  `
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS needs_password_change BOOLEAN DEFAULT FALSE`

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_token VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      expires DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `
}

async function seedAdminUser() {
  const adminExists = await sql`
    SELECT id FROM users WHERE email = 'admin@vlar.com'
  `
  if (adminExists.length === 0) {
    const bcrypt = await import("bcryptjs")
    const hashed = await bcrypt.hash("admin123#", 10)
    await sql`
      INSERT INTO users (id,name,email,password,is_admin,needs_password_change)
      VALUES (UUID(),'Admin','admin@vlar.com',${hashed},TRUE,FALSE)
    `
  }

  const altAdminExists = await sql`
    SELECT id FROM users WHERE email = 'contato@vlar.com'
  `
  if (altAdminExists.length === 0) {
    const bcrypt = await import("bcryptjs")
    const hashed = await bcrypt.hash("admin123#", 10)
    await sql`
      INSERT INTO users (name,email,password,is_admin,needs_password_change)
      VALUES ('Contato','contato@vlar.com',${hashed},TRUE,FALSE)
    `
  }
}

async function main() {
  await createTables()
  await seedAdminUser()
}

main()
