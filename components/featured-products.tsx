"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import type { Product } from "@/types"

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Products Carousel */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-72"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
