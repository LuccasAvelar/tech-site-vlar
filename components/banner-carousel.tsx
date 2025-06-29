"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Bem-vindo à Vlar",
    subtitle: "Os melhores vaporizadores e produtos tech",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Ver Produtos",
    link: "#produtos",
  },
  {
    id: 2,
    title: "Novos Vaporizadores",
    subtitle: "Descubra nossa linha premium",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Explorar",
    link: "/categoria/vaporizadores",
  },
  {
    id: 3,
    title: "Frete Grátis",
    subtitle: "Em compras acima de R$ 299",
    image: "/placeholder.svg?height=500&width=1200",
    cta: "Aproveitar",
    link: "#",
  },
]

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banners[currentIndex].image})`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                >
                  {banners[currentIndex].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl mb-8 text-gray-200"
                >
                  {banners[currentIndex].subtitle}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600 text-lg px-8 py-3"
                  >
                    {banners[currentIndex].cta}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-gray-800"
        onClick={prevBanner}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-gray-800"
        onClick={nextBanner}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-cyan-400" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export { BannerCarousel }
