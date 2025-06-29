"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import LoginModal from "./login-modal"
import CartModal from "./cart-modal"
import SearchBar from "./search-bar"

export default function Header() {
  const { items } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const departments = [
    {
      name: "Vaporizadores",
      slug: "vaporizadores",
      items: [
        { name: "Descartáveis", slug: "descartaveis" },
        { name: "Recarregáveis", slug: "recarregaveis" },
      ],
    },
    {
      name: "Líquidos",
      slug: "liquidos",
      items: [
        { name: "Nic Salt", slug: "nic-salt" },
        { name: "Freebase", slug: "freebase" },
      ],
    },
    {
      name: "Reposição",
      slug: "reposicao",
      items: [
        { name: "Coils", slug: "coils" },
        { name: "Baterias", slug: "baterias" },
        { name: "Capas", slug: "capas" },
        { name: "Carregadores", slug: "carregadores" },
      ],
    },
    {
      name: "Eletrônicos",
      slug: "eletronicos",
      items: [],
    },
    {
      name: "Informática",
      slug: "informatica",
      items: [
        { name: "SSD's", slug: "ssds" },
        { name: "Periféricos", slug: "perifericos" },
        { name: "Memória RAM", slug: "memoria-ram" },
        { name: "Baterias", slug: "baterias-info" },
        { name: "Cabos", slug: "cabos" },
        { name: "HD's", slug: "hds" },
        { name: "Fontes", slug: "fontes" },
        { name: "Coolers", slug: "coolers" },
        { name: "Gabinetes", slug: "gabinetes" },
      ],
    },
  ]

  return (
    <>
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        {/* Frete Info Bar */}
        <div className="bg-cyan-400 text-black text-center py-1 text-sm">
          🚚 Frete grátis para compras acima de R$ 299
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center"
            >
              <img src="/vlar-icon.png" alt="Vlar" className="w-8 h-8 mr-2" />
              Vlar
            </Link>

            {/* Search Bar */}
            <SearchBar className="flex-1 max-w-2xl mx-8 hidden md:block" />

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Contact Link */}
              <Link href="/contato" className="text-gray-300 hover:text-cyan-400 transition-colors hidden md:block">
                Contato
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-cyan-400 relative"
                onClick={() => setShowCartModal(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* User Menu */}
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
                      <Link href="/perfil">
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-gray-300">
                      <Link href="/meus-pedidos">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Meus Pedidos</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="text-gray-300">
                        <Link href="/admin-user-modify">
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
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                className="md:hidden text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <SearchBar className="md:hidden mt-4" />
        </div>

        {/* Departments Navigation */}
        <div className="bg-cyan-400 border-t border-cyan-500">
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center space-x-8 py-3">
              {departments.map((dept) => (
                <div key={dept.name} className="relative group">
                  <Link
                    href={`/categoria/${dept.slug}`}
                    className="text-black hover:text-gray-800 font-medium py-2 px-3 rounded transition-colors flex items-center"
                  >
                    {dept.name}
                    {dept.items.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {dept.items.length > 0 && (
                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {dept.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/categoria/${dept.slug}/${item.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-cyan-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Departments */}
            <div className="md:hidden py-3">
              <Button
                variant="ghost"
                className="text-black hover:text-gray-800 font-medium"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4 mr-2" />
                DEPARTAMENTOS
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {/* Mobile Contact */}
                <Link
                  href="/contato"
                  className="block text-cyan-400 hover:text-cyan-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contato
                </Link>

                {/* Mobile Departments */}
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <div key={dept.name} className="border-b border-gray-800 pb-2">
                      <Link
                        href={`/categoria/${dept.slug}`}
                        className="block font-medium text-white hover:text-cyan-400 mb-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {dept.name}
                      </Link>
                      {dept.items.length > 0 && (
                        <div className="pl-4 space-y-1">
                          {dept.items.map((item) => (
                            <Link
                              key={item.slug}
                              href={`/categoria/${dept.slug}/${item.slug}`}
                              className="block text-sm text-gray-400 hover:text-cyan-400"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              • {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <CartModal open={showCartModal} onOpenChange={setShowCartModal} />
    </>
  )
}

export { Header }
