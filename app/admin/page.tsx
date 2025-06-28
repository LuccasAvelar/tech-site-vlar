"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Users, ShoppingCart, ImageIcon, FileText, Bell, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"
import UserManagement from "@/components/admin/user-management"
import BannerManagement from "@/components/admin/banner-management"
import ContentManagement from "@/components/admin/content-management"
import StockNotifications from "@/components/admin/stock-notifications"

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingNotifications: 0,
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
      return
    }
    fetchStats()
  }, [isAdmin, router])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, notificationsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/stock-notifications"),
      ])

      const products = await productsRes.json()
      const orders = await ordersRes.json()
      const notifications = await notificationsRes.json()

      setStats({
        totalProducts: products.length,
        totalUsers: 1,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
        pendingNotifications: notifications.filter((n: any) => !n.notified).length,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
            Painel Administrativo - Vlar
          </h1>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Produtos</CardTitle>
                <Package className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Usuários</CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Receita</CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Notificações</CardTitle>
                <Bell className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.pendingNotifications}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Gerenciamento */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800">
              <TabsTrigger value="products" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <Package className="h-4 w-4 mr-2" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="banners" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <ImageIcon className="h-4 w-4 mr-2" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <FileText className="h-4 w-4 mr-2" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
              >
                <Bell className="h-4 w-4 mr-2" />
                Estoque
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" />
                Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="banners" className="mt-6">
              <BannerManagement />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <ContentManagement />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <StockNotifications />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
