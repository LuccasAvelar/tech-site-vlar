"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ShoppingCart, Plus, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)
  const { addToCart } = useCart()

  const isOutOfStock = product.stock === 0

  const handleNotifyStock = async () => {
    setIsNotifying(true)
    try {
      const email = prompt("Digite seu email para ser notificado:")
      if (email) {
        await fetch("/api/stock-notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            email,
            productName: product.name,
          }),
        })
        alert("Você será notificado quando o produto estiver disponível!")
      }
    } catch (error) {
      console.error("Erro ao cadastrar notificação:", error)
    } finally {
      setIsNotifying(false)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: isOutOfStock ? 1 : 1.05, rotateY: isOutOfStock ? 0 : 5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`border-gray-700 overflow-hidden backdrop-blur-sm relative group ${
          isOutOfStock ? "bg-gray-800/30 opacity-75" : "bg-gray-800/50"
        }`}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isOutOfStock ? "grayscale" : "group-hover:scale-110"
            }`}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Sem Estoque
              </Badge>
            </div>
          )}

          <AnimatePresence>
            {isHovered && !isOutOfStock && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-4"
              >
                <div className="text-center text-white">
                  <p className="text-sm mb-4">{product.description}</p>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-4">
          <h3 className={`font-semibold mb-2 line-clamp-2 ${isOutOfStock ? "text-gray-400" : "text-white"}`}>
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${isOutOfStock ? "text-gray-400" : "text-cyan-400"}`}>
              {formatPrice(product.price)}
            </span>

            {isOutOfStock ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleNotifyStock}
                disabled={isNotifying}
                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
              >
                <Bell className="h-4 w-4 mr-1" />
                {isNotifying ? "..." : "Avise-me"}
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => addToCart(product)}
                className="bg-gray-700 hover:bg-cyan-400 hover:text-black transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-orange-400 text-xs mt-2">Apenas {product.stock} em estoque!</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
