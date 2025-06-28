"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import BannerCarousel from "@/components/banner-carousel"
import FeaturedProducts from "@/components/featured-products"
import ProductGrid from "@/components/product-grid"
import WhatsAppButton from "@/components/whatsapp-button"

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Simular produtos para demonstração
      const mockProducts = [
        {
          id: 1,
          name: "Vape Pod Descartável 2500 Puffs",
          price: 29.9,
          image: "/placeholder.svg",
          category: "vaporizadores",
          featured: true,
          stock: 45,
        },
        {
          id: 2,
          name: "Líquido Nic Salt 30ml",
          price: 19.9,
          image: "/placeholder.svg",
          category: "liquidos",
          featured: true,
          stock: 32,
        },
        {
          id: 3,
          name: "Coil Reposição 0.8ohm",
          price: 12.9,
          image: "/placeholder.svg",
          category: "reposicao",
          featured: false,
          stock: 78,
        },
        {
          id: 4,
          name: "SSD 480GB SATA",
          price: 189.9,
          image: "/placeholder.svg",
          category: "informatica",
          featured: true,
          stock: 15,
        },
        {
          id: 5,
          name: "Memória RAM 8GB DDR4",
          price: 159.9,
          image: "/placeholder.svg",
          category: "informatica",
          featured: false,
          stock: 23,
        },
        {
          id: 6,
          name: "Carregador USB-C",
          price: 24.9,
          image: "/placeholder.svg",
          category: "reposicao",
          featured: false,
          stock: 67,
        },
      ]

      setProducts(mockProducts)
      setFeaturedProducts(mockProducts.filter((p) => p.featured))
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Featured Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Produtos em Destaque
              </h2>
              <FeaturedProducts products={featuredProducts} isLoading={isLoading} />
            </motion.div>
          </div>
        </section>

        {/* All Products Section */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Todos os Produtos</h2>
              <ProductGrid products={products} isLoading={isLoading} />
            </motion.div>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </div>
  )
}
