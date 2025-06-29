"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  category: string
  stock: number
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  className?: string
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
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
        if (response.ok) {
          const data = await response.json()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query)
      window.location.href = `/busca?q=${encodeURIComponent(query)}`
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:ring-0"
        />
        <Button type="submit" size="icon" className="absolute right-1 top-1 bg-cyan-400 hover:bg-cyan-500 text-black">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
              <p className="mt-2">Buscando...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.id}`}
                  className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={product.image_url || "/placeholder.svg?height=40&width=40"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-cyan-600">{formatPrice(product.price)}</div>
                    <div className="text-xs text-gray-500">
                      {product.stock > 0 ? `${product.stock} em estoque` : "Sem estoque"}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-200 p-3">
                <Link
                  href={`/busca?q=${encodeURIComponent(query)}`}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todos os resultados para "{query}"
                </Link>
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhum produto encontrado para "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
