"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchBar from "@/components/search-bar"
import LoginModal from "@/components/login-modal"
import CartModal from "@/components/cart-modal"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

const departments = [
  {
    name: "VAPORIZADORES",
    subcategories: ["Pod Descartável", "Pod Recarregável", "Mod Box", "Canetas Vape", "Acessórios"],
  },
  {
    name: "LÍQUIDOS",
    subcategories: ["Nic Salt", "Freebase", "Ice", "Frutas", "Doces"],
  },
  {
    name: "REPOSIÇÃO",
    subcategories: ["Coils", "Pods", "Resistências", "Algodão", "Baterias"],
  },
  {
    name: "ELETRÔNICOS",
    subcategories: ["Carregadores", "Cabos", "Fones", "Powerbank", "Adaptadores"],
  },
  {
    name: "INFORMÁTICA",
    subcategories: ["Memórias", "SSD", "Processadores", "Placas", "Periféricos"],
  },
]

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(33) 99834-3132</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Governador Valadares - MG</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Seg-Sex: 8h-18h | Sáb: 8h-12h</span>
              </div>
            </div>
            <div className="font-semibold">🚚 FRETE GRÁTIS acima de R$ 299</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Vlar
                </h1>
                <p className="text-xs text-gray-500">Tecnologia & Vape</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">Olá, {user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Meu Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/meus-pedidos">Meus Pedidos</Link>
                    </DropdownMenuItem>
                    {user.is_admin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Painel Admin</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">Entrar</span>
                </Button>
              )}

              {/* Cart */}
              <Button variant="ghost" onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {totalItems}
                  </Badge>
                )}
                <span className="hidden md:inline">Carrinho</span>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-6">
                    <SearchBar />
                    <nav className="flex flex-col gap-4">
                      {departments.map((dept) => (
                        <div key={dept.name} className="border-b pb-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {dept.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/categoria/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Desktop */}
      <div className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center">
            {departments.map((department) => (
              <div key={department.name} className="relative group">
                <button className="px-6 py-4 font-medium hover:bg-white/10 transition-colors">{department.name}</button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 bg-white text-gray-900 shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                  <div className="py-2">
                    {department.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/categoria/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Link href="/contato" className="px-6 py-4 font-medium hover:bg-white/10 transition-colors">
              CONTATO
            </Link>
          </nav>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      <div className="md:hidden bg-gray-50 border-b p-4">
        <SearchBar />
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
