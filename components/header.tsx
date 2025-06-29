"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import LoginModal from "./login-modal"
import CartModal from "./cart-modal"
import SearchBar from "./search-bar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="hidden md:flex items-center space-x-4 text-gray-400">
              <span>📞 (33) 99834-3132</span>
              <span>✉️ contato@vlar.com</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span className="text-cyan-400">🚚 Frete Grátis acima de R$ 199</span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Vlar
                </h1>
                <p className="text-xs text-gray-400">Vaporizadores & Tecnologia</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Mobile */}
              <Button variant="ghost" size="sm" className="md:hidden text-gray-400 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/perfil">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <User className="h-5 w-5 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:flex text-gray-400 hover:text-white"
                >
                  <User className="h-5 w-5 mr-2" />
                  Entrar
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative text-gray-400 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-cyan-400 text-black text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block border-t border-gray-800 py-4">
            <div className="flex items-center justify-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                INÍCIO
              </Link>
              <div className="relative group">
                <button className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  DEPARTAMENTOS
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/categoria/vaporizadores"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Vaporizadores
                    </Link>
                    <Link
                      href="/categoria/liquidos"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Líquidos
                    </Link>
                    <Link
                      href="/categoria/reposicao"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Reposição
                    </Link>
                    <Link
                      href="/categoria/eletronicos"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Eletrônicos
                    </Link>
                    <Link
                      href="/categoria/informatica"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Informática
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/contato" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                CONTATO
              </Link>
              {user && (
                <Link href="/meus-pedidos" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                  MEUS PEDIDOS
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBar />
              </div>

              <Link
                href="/"
                className="block text-gray-300 hover:text-cyan-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <div className="space-y-2">
                <p className="text-gray-400 font-medium">Departamentos</p>
                <Link
                  href="/categoria/vaporizadores"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-1 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vaporizadores
                </Link>
                <Link
                  href="/categoria/liquidos"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-1 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Líquidos
                </Link>
                <Link
                  href="/categoria/reposicao"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-1 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reposição
                </Link>
                <Link
                  href="/categoria/eletronicos"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-1 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Eletrônicos
                </Link>
                <Link
                  href="/categoria/informatica"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-1 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Informática
                </Link>
              </div>
              <Link
                href="/contato"
                className="block text-gray-300 hover:text-cyan-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>

              {user ? (
                <>
                  <Link
                    href="/perfil"
                    className="block text-gray-300 hover:text-cyan-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    href="/meus-pedidos"
                    className="block text-gray-300 hover:text-cyan-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors py-2 w-full text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="block text-gray-300 hover:text-cyan-400 transition-colors py-2 w-full text-left"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  )
}
