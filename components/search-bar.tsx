"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  stock: number
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (response.ok) {
          setResults(data.products || [])
          setIsOpen(true)
        }
      } catch (error) {
        console.error("Erro na busca:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
              <p className="mt-2">Buscando...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => {
                    // Aqui você pode adicionar navegação para a página do produto
                    console.log("Produto selecionado:", product)
                    setIsOpen(false)
                  }}
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md bg-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-cyan-400 font-bold">{formatPrice(product.price)}</p>
                      <p className="text-gray-400 text-sm">
                        {product.stock > 0 ? `${product.stock} em estoque` : "Sem estoque"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              <p>Nenhum produto encontrado para "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
