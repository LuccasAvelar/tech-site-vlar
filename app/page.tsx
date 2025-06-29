"use client"

import { useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BannerCarousel from "@/components/banner-carousel"
import FeaturedProducts from "@/components/featured-products"
import ProductGrid from "@/components/product-grid"
import WhatsAppButton from "@/components/whatsapp-button"

export default function HomePage() {
  useEffect(() => {
    // Inicializar banco de dados se necessário
    const initDB = async () => {
      try {
        await fetch("/api/init")
      } catch (error) {
        console.error("Erro ao inicializar banco:", error)
      }
    }

    initDB()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
              Produtos em Destaque
            </h2>
            <FeaturedProducts />
          </div>
        </section>

        {/* All Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
              Todos os Produtos
            </h2>
            <ProductGrid />
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
