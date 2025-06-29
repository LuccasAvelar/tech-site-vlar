"use client"

import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { LoginModal } from "./login-modal"
import { CartModal } from "./cart-modal"

export function Header() {
  const { items } = useCart()
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const departments = [
    {
      name: "Vaporizadores",
      items: ["Descartáveis", "Recarregáveis"],
    },
    {
      name: "Líquidos",
      items: ["Nic Salt", "Freebase"],
    },
    {
      name: "Reposição",
      items: ["Coils", "Baterias", "Capas", "Carregadores"],
    },
    {
      name: "Eletrônicos",
      items: [],
    },
    {
      name: "Informática",
      items: ["SSD's", "Periféricos", "Memória RAM", "Baterias", "Cabos", "HD's", "Fontes", "Coolers", "Gabinetes"],
    },
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        {/* Top Bar */}
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <span className="text-cyan-600 font-medium">Frete grátis para compras acima de R$ 299</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Payment Icons */}
                <div className="flex items-center space-x-2">
                  <img src="/payment-icons/visa.png" alt="Visa" className="h-4" />
                  <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-4" />
                  <img src="/payment-icons/amex.png" alt="Amex" className="h-4" />
                  <img src="/payment-icons/elo.png" alt="Elo" className="h-4" />
                  <img src="/payment-icons/pix.png" alt="PIX" className="h-4" />
                  <img src="/payment-icons/boleto.png" alt="Boleto" className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/vlar-icon.png" alt="Vlar" className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Vlar
              </h1>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="w-full pl-4 pr-12 py-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-lg"
                />
                <Button size="sm" className="absolute right-1 top-1 bg-cyan-400 hover:bg-cyan-500 text-black">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(true)}
                className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-cyan-600"
              >
                <User className="h-5 w-5" />
                <span>{user ? user.name : "Entrar"}</span>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                onClick={() => setShowCartModal(true)}
                className="relative text-gray-700 hover:text-cyan-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs">{totalItems}</Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-4 pr-12 py-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-lg"
              />
              <Button size="sm" className="absolute right-1 top-1 bg-cyan-400 hover:bg-cyan-500 text-black">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Departments Navigation */}
        <div className="bg-cyan-400 py-3">
          <div className="container mx-auto px-4">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-6">
                {departments.map((dept) => (
                  <NavigationMenuItem key={dept.name}>
                    {dept.items.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent text-black hover:bg-cyan-500 font-medium">
                          {dept.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-48 gap-2 p-4">
                            {dept.items.map((item) => (
                              <a
                                key={item}
                                href="#"
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Button variant="ghost" className="bg-transparent text-black hover:bg-cyan-500 font-medium">
                        {dept.name}
                      </Button>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Departments */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="bg-transparent text-black hover:bg-cyan-500 font-medium"
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
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {/* User Menu Mobile */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLoginModal(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full justify-start text-gray-700"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user ? user.name : "Entrar"}
                </Button>

                {/* Departments Mobile */}
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <div key={dept.name} className="border-b pb-2">
                      <h3 className="font-medium text-gray-900 mb-2">{dept.name}</h3>
                      {dept.items.length > 0 && (
                        <div className="pl-4 space-y-1">
                          {dept.items.map((item) => (
                            <a key={item} href="#" className="block text-sm text-gray-600 hover:text-cyan-600">
                              {item}
                            </a>
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

export default Header
