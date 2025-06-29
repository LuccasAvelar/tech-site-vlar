"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import BannerCarousel from "@/components/banner-carousel"
import FeaturedProducts from "@/components/featured-products"
import ProductGrid from "@/components/product-grid"
import WhatsAppButton from "@/components/whatsapp-button"

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
      // Simular produtos para demonstração
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Vape Pod Descartável 2500 Puffs",
          description: "Vaporizador descartável com 2500 puffs, sabor frutas vermelhas",
          price: 29.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "vaporizadores",
          stock: 45,
          sku: "VP001",
        },
        {
          id: 2,
          name: "Líquido Nic Salt 30ml",
          description: "Líquido para vape com nicotina salt, diversos sabores disponíveis",
          price: 19.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "liquidos",
          stock: 32,
          sku: "LQ001",
        },
        {
          id: 3,
          name: "Coil Reposição 0.8ohm",
          description: "Resistência de reposição para vaporizadores, 0.8ohm",
          price: 12.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "reposicao",
          stock: 78,
          sku: "CR001",
        },
        {
          id: 4,
          name: "SSD 480GB SATA",
          description: "SSD de alta velocidade para melhor performance do seu PC",
          price: 189.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "informatica",
          stock: 15,
          sku: "SSD001",
        },
        {
          id: 5,
          name: "Memória RAM 8GB DDR4",
          description: "Memória RAM DDR4 8GB para upgrade do seu computador",
          price: 159.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "informatica",
          stock: 23,
          sku: "RAM001",
        },
        {
          id: 6,
          name: "Carregador USB-C",
          description: "Carregador rápido USB-C compatível com diversos dispositivos",
          price: 24.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "eletronicos",
          stock: 67,
          sku: "CHG001",
        },
      ]

      setProducts(mockProducts)
      setFeaturedProducts(mockProducts.slice(0, 4))
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
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
