"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductGrid from "@/components/product-grid"
import Header from "@/components/header"
import WhatsAppButton from "@/components/whatsapp-button"
import BannerCarousel from "@/components/banner-carousel"
import CategoryShowcase from "@/components/category-showcase"
import type { Product, Banner } from "@/types"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, bannersRes] = await Promise.all([fetch("/api/products"), fetch("/api/banners")])

      const productsData = await productsRes.json()
      const bannersData = await bannersRes.json()

      setProducts(productsData)
      setBanners(bannersData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main>
        {/* Banner Principal */}
        <BannerCarousel banners={banners} />

        {/* Showcase de Categorias */}
        <CategoryShowcase />

        {/* Produtos em Destaque */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Produtos em Destaque</h2>
            <p className="text-gray-300">Confira nossa seleção especial</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </main>

      <WhatsAppButton />
    </div>
  )
}
