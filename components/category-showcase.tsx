"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const showcaseCategories = [
  {
    title: "MONTE O SEU PC",
    subtitle: "CUSTOM",
    description: "DO SEU JEITO",
    image: "/placeholder.svg?height=300&width=300",
    link: "/monte-seu-pc",
    color: "from-blue-500 to-purple-600",
  },
  {
    title: "MONTE O SEU PC",
    subtitle: "GAMER",
    description: "",
    image: "/placeholder.svg?height=300&width=300",
    link: "/pc-gamer",
    color: "from-red-500 to-orange-600",
  },
  {
    title: "MONTE O SEU PC",
    subtitle: "MOBA",
    description: "",
    image: "/placeholder.svg?height=300&width=300",
    link: "/pc-moba",
    color: "from-green-500 to-teal-600",
  },
  {
    title: "MONTE O SEU PC",
    subtitle: "HOME",
    description: "",
    image: "/placeholder.svg?height=300&width=300",
    link: "/pc-home",
    color: "from-gray-500 to-gray-700",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {showcaseCategories.map((category, index) => (
          <motion.div
            key={category.title + category.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={category.link}>
              <Card className="bg-gray-800/50 border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={`${category.title} ${category.subtitle}`}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                      <p className="text-sm font-medium mb-1">{category.title}</p>
                      <h3 className="text-2xl font-bold mb-1">{category.subtitle}</h3>
                      {category.description && <p className="text-sm opacity-90">{category.description}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
