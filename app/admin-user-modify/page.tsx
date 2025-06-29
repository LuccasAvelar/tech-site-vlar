"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Users, Package, ShoppingCart, DollarSign, Plus, Edit, Trash2, Eye } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
  category: string
  stock: number
  sku: string
}

interface User {
  id: number
  name: string
  email: string
  phone?: string
  is_admin: boolean
  created_at: string
}

export default function AdminUserModify() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/admin-login")
      return
    }

    if (user && user.isAdmin) {
      fetchData()
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      // Buscar produtos
      const productsResponse = await fetch("/api/products")
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
        setStats((prev) => ({ ...prev, totalProducts: productsData.length }))
      }

      // Simular outros dados para demonstração
      setStats((prev) => ({
        ...prev,
        totalUsers: 150,
        totalOrders: 89,
        totalRevenue: 15420.5,
      }))
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Acesso negado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ERP - Vlar Admin</h1>
          <p className="text-gray-400">Bem-vindo, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Usuários</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Produtos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Pedidos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Receita Total</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="products" className="data-[state=active]:bg-cyan-600">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-600">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-600">
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Gerenciar Produtos</CardTitle>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder.svg?height=60&width=60"}
                          alt={product.name}
                          className="w-15 h-15 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{product.name}</h3>
                          <p className="text-gray-400 text-sm">{product.category}</p>
                          <p className="text-cyan-400 font-bold">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock} em estoque
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Funcionalidade de gerenciamento de usuários em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                  <p>Funcionalidade de gerenciamento de pedidos em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="site-name" className="text-white">
                      Nome do Site
                    </Label>
                    <Input id="site-name" defaultValue="Vlar" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="site-description" className="text-white">
                      Descrição
                    </Label>
                    <Textarea
                      id="site-description"
                      defaultValue="Os melhores vaporizadores e produtos tech"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">Salvar Configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
