"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, User, LogOut, Settings, Search, Menu, ChevronDown, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import type { Category } from "@/types"

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
    >
      {/* Top Bar */}
      <div className="bg-gray-900 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>Frete grátis para compras acima de R$ 299</span>
            <div className="flex space-x-4">
              <Link href="/contato" className="hover:text-cyan-400">
                Contato
              </Link>
              <Link href="/rastreamento" className="hover:text-cyan-400">
                Rastrear Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Vlar
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Pesquise o seu produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-white text-black border-0 rounded-lg"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/carrinho" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-300">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-cyan-400 text-black">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">Olá, {user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
                  <DropdownMenuItem asChild className="text-gray-300">
                    <Link href="/meus-pedidos">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="text-gray-300">
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Administração</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-gray-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="flex space-x-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-none">
                  <Menu className="h-4 w-4 mr-2" />
                  DEPARTAMENTOS
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white p-4 w-80">
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categoria/${category.slug}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <div className="flex items-center space-x-8 ml-8">
                <Link href="/hardware" className="text-gray-300 hover:text-white py-3 px-4 transition-colors">
                  HARDWARE
                </Link>
                <Link href="/notebooks" className="text-gray-300 hover:text-white py-3 px-4 transition-colors">
                  NOTEBOOKS
                </Link>
                <Link href="/monitores" className="text-gray-300 hover:text-white py-3 px-4 transition-colors">
                  MONITORES
                </Link>
                <Link href="/pc-gamer" className="text-gray-300 hover:text-white py-3 px-4 transition-colors">
                  PC GAMER
                </Link>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </motion.header>
  )
}
