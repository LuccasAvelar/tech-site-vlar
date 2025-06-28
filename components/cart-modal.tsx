"use client"
import { useState } from "react"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartModal({ open, onOpenChange }: CartModalProps) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    // Simular processo de checkout
    setTimeout(() => {
      alert("Redirecionando para o checkout...")
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-gray-300">Seu Carrinho</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <ShoppingBag className="h-16 w-16 text-gray-600" />
            <p className="text-gray-400 text-center">Seu carrinho está vazio</p>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
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
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-gray-300">
            Seu Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded" />

              <div className="flex-1">
                <h3 className="font-medium text-white truncate">{item.name}</h3>
                <p className="text-cyan-400 font-bold">{formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-600 text-gray-300 bg-transparent"
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="w-8 text-center text-white">{item.quantity}</span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-600 text-gray-300 bg-transparent"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-300">Total:</span>
            <span className="text-cyan-400">{formatPrice(total)}</span>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => clearCart()}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Limpar Carrinho
            </Button>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
            >
              {isLoading ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
