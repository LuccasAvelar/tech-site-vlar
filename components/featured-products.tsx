"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  category: string
  stock: number
  sku?: string
}

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProducts(1)
      } else if (window.innerWidth < 768) {
        setVisibleProducts(2)
      } else if (window.innerWidth < 1024) {
        setVisibleProducts(3)
      } else {
        setVisibleProducts(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (products.length > visibleProducts) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= products.length - visibleProducts ? 0 : prev + 1))
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [products.length, visibleProducts])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= products.length - visibleProducts ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? products.length - visibleProducts : prev - 1))
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg?height=200&width=200",
      quantity: 1,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (!products || products.length === 0) {
    return <div className="text-center text-gray-400 py-8">Nenhum produto em destaque encontrado.</div>
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleProducts}%` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors h-full">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image || "/placeholder.svg?height=200&width=200"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded"
                    />
                    {product.stock < 10 && (
                      <Badge className="absolute top-2 right-2 bg-red-600">Últimas unidades</Badge>
                    )}
                  </div>

                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-400">{formatPrice(product.price)}</span>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-cyan-400 text-black hover:bg-cyan-500"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">{product.stock} em estoque</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      {products.length > visibleProducts && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 border-gray-600 text-white hover:bg-gray-800"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 border-gray-600 text-white hover:bg-gray-800"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {products.length > visibleProducts && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: products.length - visibleProducts + 1 }).map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-cyan-400" : "bg-gray-600"}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { FeaturedProducts }
