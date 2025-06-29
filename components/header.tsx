"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import SearchBar from "./search-bar"
import CartModal from "./cart-modal"
import LoginModal from "./login-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { itemCount } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const menuItems = [
    { name: "INÍCIO", href: "/" },
    { name: "VAPORIZADORES", href: "/categoria/vaporizadores" },
    { name: "LÍQUIDOS", href: "/categoria/liquidos" },
    { name: "ACESSÓRIOS", href: "/categoria/acessorios" },
    { name: "KITS", href: "/categoria/kits" },
    { name: "CONTATO", href: "/contato" },
  ]

  return (
    <>
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-sm border-b border-gray-800">
            <div className="text-gray-400">📞 (11) 99999-9999 | 📧 contato@vlar.com</div>
            <div className="hidden md:flex items-center space-x-4 text-gray-400">
              <span>🚚 Frete grátis acima de R$ 200</span>
              <span>💳 Até 12x sem juros</span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Vlar
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-cyan-400">
                      <User className="h-5 w-5 mr-2" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="text-white hover:text-cyan-400">
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/meus-pedidos" className="text-white hover:text-cyan-400">
                        Meus Pedidos
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-white hover:text-cyan-400">
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="text-white hover:text-cyan-400">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Entrar</span>
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-cyan-400"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs min-w-[1.25rem] h-5">
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:block border-t border-gray-800">
            <div className="flex items-center justify-center space-x-8 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Search Bar - Mobile */}
          <div className="md:hidden py-4 border-t border-gray-800">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-cyan-400 font-medium transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Modals */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
