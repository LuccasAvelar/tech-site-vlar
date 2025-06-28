"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Plus, Minus, CreditCard, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { formatPrice } from "@/lib/utils"

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartModal({ open, onOpenChange }: CartModalProps) {
  const { items, updateQuantity, removeFromCart } = useCart()
  const { user } = useAuth()
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map((item) => item.id))
  const [paymentMethod, setPaymentMethod] = useState("")
  const [installments, setInstallments] = useState("1")
  const [couponCode, setCouponCode] = useState("")
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const selectedTotal = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    const selectedProducts = items.filter((item) => selectedItems.includes(item.id))
    const customerData = user || guestData

    if (!customerData.name || !customerData.email || !guestData.address) {
      alert("Preencha todos os dados obrigatórios")
      return
    }

    const orderData = {
      products: selectedProducts,
      total: selectedTotal,
      paymentMethod,
      installments: paymentMethod === "credit" ? installments : "1",
      address: guestData.address,
      couponCode,
      customer: customerData,
      isGuest: !user,
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        alert("Pedido realizado com sucesso!")
        selectedProducts.forEach((item) => removeFromCart(item.id))
        setSelectedItems([])
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error)
      alert("Erro ao finalizar pedido. Tente novamente.")
    }
  }

  if (items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Carrinho Vazio</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
            >
              Continuar Comprando
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Carrinho de Compras
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items do Carrinho */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                    />

                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                      <p className="text-cyan-400 font-bold">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 border-gray-600"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-white w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 border-gray-600"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Checkout */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {/* Dados do Cliente */}
              {!user && (
                <div className="space-y-3">
                  <Label className="text-gray-300">Dados do Cliente</Label>
                  <Input
                    placeholder="Nome completo"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Telefone"
                    value={guestData.phone}
                    onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              )}

              {/* Endereço */}
              <div className="space-y-2">
                <Label className="text-gray-300">Endereço de Entrega</Label>
                <Input
                  placeholder="Digite seu endereço completo"
                  value={guestData.address}
                  onChange={(e) => setGuestData({ ...guestData, address: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              {/* Método de Pagamento */}
              <div className="space-y-3">
                <Label className="text-gray-300">Método de Pagamento</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center text-gray-300 text-sm">
                      <Smartphone className="h-4 w-4 mr-2" />
                      PIX
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex items-center text-gray-300 text-sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cartão de Crédito
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-white mb-2">
                  <span>Total:</span>
                  <span className="text-xl font-bold text-cyan-400">{formatPrice(selectedTotal)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                disabled={selectedItems.length === 0 || !paymentMethod || !guestData.address}
              >
                Finalizar Compra
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
