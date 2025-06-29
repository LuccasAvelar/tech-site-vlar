"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Eye } from "lucide-react"
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

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()

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

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      vaporizadores: "Vaporizadores",
      liquidos: "Líquidos",
      reposicao: "Reposição",
      eletronicos: "Eletrônicos",
      informatica: "Informática",
      storage: "Armazenamento",
      gpu: "Placas de Vídeo",
      cpu: "Processadores",
      memory: "Memórias",
      monitor: "Monitores",
      peripherals: "Periféricos",
    }
    return categories[category] || category
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p className="text-xl mb-4">Nenhum produto encontrado</p>
        <p>Tente ajustar seus filtros ou volte mais tarde.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-300 h-full">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />

                {/* Category Badge */}
                <Badge className="absolute top-2 left-2 bg-cyan-600 text-white">
                  {getCategoryName(product.category)}
                </Badge>

                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 bg-orange-600">Últimas {product.stock}</Badge>
                )}

                {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-red-600">Esgotado</Badge>}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

                {product.description && <p className="text-gray-400 text-xs line-clamp-2">{product.description}</p>}

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xl font-bold text-cyan-400">{formatPrice(product.price)}</span>
                    <p className="text-gray-500 text-xs">
                      {product.stock > 0 ? `${product.stock} disponível` : "Indisponível"}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-cyan-400 text-black hover:bg-cyan-500 disabled:bg-gray-600 disabled:text-gray-400"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export { ProductGrid }
