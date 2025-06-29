"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { BannerCarousel } from "@/components/banner-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { ProductGrid } from "@/components/product-grid"
import { WhatsAppButton } from "@/components/whatsapp-button"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
  category: string
  stock: number
  sku: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=12")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        // Pegar os primeiros 6 como produtos em destaque
        setFeaturedProducts(data.slice(0, 6))
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Produtos em Destaque</h2>
            {loading ? (
              <div className="text-center text-white">Carregando produtos...</div>
            ) : (
              <FeaturedProducts products={featuredProducts} />
            )}
          </div>
        </section>

        {/* All Products */}
        <section className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Todos os Produtos</h2>
            {loading ? (
              <div className="text-center text-white">Carregando produtos...</div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </div>
  )
}
