"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StockNotification } from "@/types"

export default function StockNotifications() {
  const [notifications, setNotifications] = useState<StockNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/stock-notifications")
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsNotified = async (notificationId: string) => {
    try {
      await fetch(`/api/stock-notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notified: true }),
      })
      fetchNotifications()
    } catch (error) {
      console.error("Erro ao marcar como notificado:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (confirm("Tem certeza que deseja excluir esta notificação?")) {
      try {
        await fetch(`/api/stock-notifications/${notificationId}`, {
          method: "DELETE",
        })
        fetchNotifications()
      } catch (error) {
        console.error("Erro ao excluir notificação:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Notificações de Estoque</h2>
        <Badge variant="secondary" className="bg-cyan-400 text-black">
          {notifications.filter((n) => !n.notified).length} pendentes
        </Badge>
      </div>

      {notifications.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma notificação de estoque encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{notification.customerName || "Cliente"}</CardTitle>
                    <Badge variant={notification.notified ? "secondary" : "destructive"}>
                      {notification.notified ? "Notificado" : "Pendente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm">Email:</p>
                    <p className="text-white">{notification.customerEmail}</p>
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm">Produto:</p>
                    <p className="text-white">{notification.productId}</p>
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm">Data:</p>
                    <p className="text-white">{new Date(notification.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>

                  <div className="flex space-x-2">
                    {!notification.notified && (
                      <Button
                        size="sm"
                        onClick={() => markAsNotified(notification.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Marcar como Notificado
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
