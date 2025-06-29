"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BannerCarousel from "@/components/banner-carousel"
import FeaturedProducts from "@/components/featured-products"
import ProductGrid from "@/components/product-grid"
import WhatsAppButton from "@/components/whatsapp-button"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  featured: boolean
  category_name?: string
}

interface Banner {
  id: number
  title: string
  image_url: string
  link_url: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Buscar produtos
      const productsResponse = await fetch("/api/products")
      const productsData = await productsResponse.json()

      if (productsResponse.ok) {
        setProducts(productsData.products || [])
      } else {
        // Fallback com produtos mock se a API falhar
        setProducts([
          {
            id: 1,
            name: "Vape Pod Descartável 2500 Puffs",
            description: "Vaporizador descartável com 2500 puffs, sabor menta",
            price: 29.9,
            stock: 50,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
            category_name: "Vaporizadores",
          },
          {
            id: 2,
            name: "Líquido Nic Salt 30ml",
            description: "Líquido premium com nicotina salt, diversos sabores",
            price: 24.9,
            stock: 100,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
            category_name: "Líquidos",
          },
          {
            id: 3,
            name: "Kit Vape Recarregável",
            description: "Kit completo com vaporizador recarregável e acessórios",
            price: 89.9,
            stock: 25,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
            category_name: "Vaporizadores",
          },
          {
            id: 4,
            name: "SSD 480GB SATA",
            description: "SSD SATA 480GB para upgrade de performance",
            price: 159.9,
            stock: 30,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: true,
            category_name: "Informática",
          },
          {
            id: 5,
            name: "Mouse Gamer RGB",
            description: "Mouse gamer com iluminação RGB e alta precisão",
            price: 79.9,
            stock: 40,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: false,
            category_name: "Informática",
          },
          {
            id: 6,
            name: "Coil 0.6ohm Pack 5un",
            description: "Pack com 5 resistências 0.6ohm compatíveis",
            price: 19.9,
            stock: 75,
            image_url: "/placeholder.svg?height=300&width=300",
            featured: false,
            category_name: "Reposição",
          },
        ])
      }

      // Banners mock
      setBanners([
        {
          id: 1,
          title: "Bem-vindo à Vlar",
          image_url: "/placeholder.svg?height=400&width=1200",
          link_url: "/",
        },
        {
          id: 2,
          title: "Promoção Vaporizadores",
          image_url: "/placeholder.svg?height=400&width=1200",
          link_url: "/categoria/vaporizadores",
        },
        {
          id: 3,
          title: "Novos Líquidos",
          image_url: "/placeholder.svg?height=400&width=1200",
          link_url: "/categoria/liquidos",
        },
      ])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Usar dados mock em caso de erro
      setProducts([])
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const featuredProducts = products.filter((product) => product.featured)
  const allProducts = products

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main>
        {/* Banner Carousel */}
        <BannerCarousel banners={banners} />

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
                Produtos em Destaque
              </h2>
              <FeaturedProducts products={featuredProducts} />
            </div>
          </section>
        )}

        {/* All Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
              Todos os Produtos
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <ProductGrid products={allProducts} />
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton
        phoneNumber="5533998343132"
        message="Olá! Gostaria de mais informações sobre os produtos da Vlar."
      />
    </div>
  )
}
