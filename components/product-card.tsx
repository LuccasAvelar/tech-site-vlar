"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  if (!product) {
    return null
  }

  const handleAddToCart = async () => {
    if (product.stock <= 0) return

    setIsLoading(true)
    try {
      addToCart(product)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <Card className="group bg-gray-800/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-700">
          <Image
            src={product.image_url || product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Sem Estoque
              </Badge>
            </div>
          )}

          {product.featured && <Badge className="absolute top-2 left-2 bg-cyan-400 text-black">Destaque</Badge>}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>

          {product.description && <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-cyan-400">{formatPrice(product.price)}</p>
              {product.stock > 0 && <p className="text-xs text-gray-500">{product.stock} em estoque</p>}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isLoading}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
