"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const { items, updateQuantity, removeItem, total } = useCart()

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = "/carrinho"
    onOpenChange(false)
  }

  if (items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Carrinho</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
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
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">
            Carrinho ({items.reduce((sum, item) => sum + item.quantity, 0)} itens)
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
              <img
                src={item.image || "/placeholder.svg?height=60&width=60"}
                alt={item.name}
                className="w-15 h-15 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{item.name}</h4>
                <p className="text-cyan-400 font-bold">R$ {item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-gray-600 bg-transparent"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Badge variant="outline" className="border-gray-600 text-white">
                    {item.quantity}
                  </Badge>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-gray-600 bg-transparent"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold text-cyan-400">R$ {total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 bg-transparent text-white hover:bg-gray-800"
            >
              Continuar
            </Button>
            <Button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CartModal
