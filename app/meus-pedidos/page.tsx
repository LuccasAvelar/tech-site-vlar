"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types"

const statusConfig = {
  pending: { label: "Preparando", icon: Clock, color: "bg-yellow-500" },
  confirmed: { label: "Confirmado", icon: CheckCircle, color: "bg-blue-500" },
  shipped: { label: "Enviado", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Entregue", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-red-500" },
  returned: { label: "Devolvido", icon: RotateCcw, color: "bg-gray-500" },
}

export default function MeusPedidosPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user/${user?.id}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-300">Faça login para ver seus pedidos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-white mb-8">Meus Pedidos</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Nenhum pedido encontrado</h2>
                <p className="text-gray-400">Você ainda não fez nenhum pedido</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">Pedido #{order.id}</CardTitle>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Badge className={`${status.color} text-white`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Produtos */}
                          <div>
                            <h4 className="text-white font-medium mb-2">Produtos:</h4>
                            <div className="space-y-2">
                              {order.products?.map((item) => (
                                <div key={item.id} className="flex justify-between text-gray-300">
                                  <span>
                                    {item.name} (x{item.quantity})
                                  </span>
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="border-t border-gray-600 pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-semibold">Total:</span>
                              <span className="text-cyan-400 font-bold text-lg">{formatPrice(order.total)}</span>
                            </div>
                          </div>

                          {/* Código de Rastreamento */}
                          {order.trackingCode && (
                            <div className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-300 text-sm">Código de Rastreamento:</p>
                              <p className="text-white font-mono">{order.trackingCode}</p>
                            </div>
                          )}

                          {/* Ações */}
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                              Ver Detalhes
                            </Button>
                            {order.trackingCode && (
                              <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                                Rastrear Pedido
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
