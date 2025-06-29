"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ImageIcon,
  Settings,
  FileText,
  Truck,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  Upload,
  Mail,
  LogOut,
  Home,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminERPPage() {
  const { user, isAdmin, loading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Verificação de acesso admin
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push("/404")
        return
      }
      fetchData()
    }
  }, [user, isAdmin, loading, router])

  const fetchData = async () => {
    try {
      // Simular carregamento de dados do banco
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDataLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setIsDataLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/admin-login")
  }

  // Loading state
  if (loading || isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <div className="text-white">Carregando ERP...</div>
        </div>
      </div>
    )
  }

  // Redirect if not admin
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Vlar ERP
            </h1>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              Admin: {user.name}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" />
              Ver Site
            </Button>
            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </Button>

            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pedidos
            </Button>

            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("customers")}
            >
              <Users className="mr-2 h-4 w-4" />
              Clientes
            </Button>

            <Button
              variant={activeTab === "financial" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("financial")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Financeiro
            </Button>

            <Button
              variant={activeTab === "shipping" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("shipping")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Transportadoras
            </Button>

            <Button
              variant={activeTab === "banners" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("banners")}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Banners
            </Button>

            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "products" && <ProductsContent />}
          {activeTab === "orders" && <OrdersContent />}
          {activeTab === "customers" && <CustomersContent />}
          {activeTab === "financial" && <FinancialContent />}
          {activeTab === "shipping" && <ShippingContent />}
          {activeTab === "banners" && <BannersContent />}
          {activeTab === "settings" && <SettingsContent />}
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-400">Última atualização: {new Date().toLocaleString("pt-BR")}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 2.847,00</div>
            <p className="text-xs text-green-400">+12% em relação a ontem</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-green-400">+5 novos pedidos</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Produtos</CardTitle>
            <Package className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-yellow-400">12 com estoque baixo</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Clientes</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.247</div>
            <p className="text-xs text-green-400">+18 novos clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Pedido</TableHead>
                <TableHead className="text-gray-300">Cliente</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">#001</TableCell>
                <TableCell className="text-white">João Silva</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Pago</Badge>
                </TableCell>
                <TableCell className="text-white">R$ 299,90</TableCell>
                <TableCell className="text-white">28/06/2025</TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">#002</TableCell>
                <TableCell className="text-white">Maria Santos</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-600">Pendente</Badge>
                </TableCell>
                <TableCell className="text-white">R$ 159,90</TableCell>
                <TableCell className="text-white">28/06/2025</TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">#003</TableCell>
                <TableCell className="text-white">Pedro Costa</TableCell>
                <TableCell>
                  <Badge className="bg-blue-600">Enviado</Badge>
                </TableCell>
                <TableCell className="text-white">R$ 89,90</TableCell>
                <TableCell className="text-white">27/06/2025</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-20 bg-cyan-400 text-black hover:bg-cyan-500">
          <div className="text-center">
            <Plus className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm">Novo Produto</div>
          </div>
        </Button>
        <Button className="h-20 bg-green-600 hover:bg-green-700">
          <div className="text-center">
            <ShoppingCart className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm">Ver Pedidos</div>
          </div>
        </Button>
        <Button className="h-20 bg-purple-600 hover:bg-purple-700">
          <div className="text-center">
            <FileText className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm">Relatórios</div>
          </div>
        </Button>
        <Button className="h-20 bg-orange-600 hover:bg-orange-700">
          <div className="text-center">
            <Settings className="h-6 w-6 mx-auto mb-1" />
            <div className="text-sm">Configurações</div>
          </div>
        </Button>
      </div>
    </div>
  )
}

// Products Component
function ProductsContent() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const sampleProducts = [
    {
      id: 1,
      name: "Vape Pod Descartável 2000 Puffs",
      category: "Vaporizadores",
      price: 29.9,
      stock: 45,
      status: "Ativo",
      sku: "VAPE001",
    },
    {
      id: 2,
      name: "Líquido Nic Salt 30ml",
      category: "Líquidos",
      price: 39.9,
      stock: 30,
      status: "Ativo",
      sku: "LIQ001",
    },
    {
      id: 3,
      name: "Coil 0.8ohm",
      category: "Reposição",
      price: 15.9,
      stock: 100,
      status: "Ativo",
      sku: "COIL001",
    },
    {
      id: 4,
      name: "SSD 1TB NVMe",
      category: "Informática",
      price: 299.9,
      stock: 5,
      status: "Estoque Baixo",
      sku: "SSD001",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Produtos</h2>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input id="name" className="bg-gray-700 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" className="bg-gray-700 border-gray-600" placeholder="Ex: VAPE001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="vaporizadores">Vaporizadores</SelectItem>
                      <SelectItem value="liquidos">Líquidos</SelectItem>
                      <SelectItem value="reposicao">Reposição</SelectItem>
                      <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                      <SelectItem value="informatica">Informática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" className="bg-gray-700 border-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input id="price" type="number" step="0.01" className="bg-gray-700 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input id="stock" type="number" className="bg-gray-700 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" step="0.001" className="bg-gray-700 border-gray-600" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" className="bg-gray-700 border-gray-600" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Imagens</Label>
                <Input id="images" type="file" multiple accept="image/*" className="bg-gray-700 border-gray-600" />
              </div>

              <div className="flex space-x-2">
                <Button className="bg-cyan-400 text-black hover:bg-cyan-500 flex-1">Salvar Produto</Button>
                <Button variant="outline" onClick={() => setShowAddProduct(false)} className="border-gray-600">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Lista de Produtos</CardTitle>
            <div className="flex space-x-2">
              <Input
                placeholder="Buscar produtos..."
                className="bg-gray-700 border-gray-600 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">SKU</TableHead>
                <TableHead className="text-gray-300">Produto</TableHead>
                <TableHead className="text-gray-300">Categoria</TableHead>
                <TableHead className="text-gray-300">Preço</TableHead>
                <TableHead className="text-gray-300">Estoque</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleProducts.map((product) => (
                <TableRow key={product.id} className="border-gray-700">
                  <TableCell className="text-white font-mono">{product.sku}</TableCell>
                  <TableCell className="text-white">{product.name}</TableCell>
                  <TableCell className="text-white">{product.category}</TableCell>
                  <TableCell className="text-white">R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-white">{product.stock}</TableCell>
                  <TableCell>
                    <Badge className={product.stock > 10 ? "bg-green-600" : "bg-yellow-600"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Orders Component
function OrdersContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Pedidos</h2>

      <Tabs defaultValue="vendidos" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="vendidos">Pedidos Vendidos</TabsTrigger>
          <TabsTrigger value="compras">Pedidos de Compra</TabsTrigger>
        </TabsList>

        <TabsContent value="vendidos" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Pedidos de Clientes</CardTitle>
                <div className="flex space-x-2">
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Pedido</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Pagamento</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-white font-mono">#001</TableCell>
                    <TableCell className="text-white">João Silva</TableCell>
                    <TableCell className="text-white">28/06/2025</TableCell>
                    <TableCell>
                      <Select defaultValue="pago">
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600">PIX</Badge>
                    </TableCell>
                    <TableCell className="text-white">R$ 299,90</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-white font-mono">#002</TableCell>
                    <TableCell className="text-white">Maria Santos</TableCell>
                    <TableCell className="text-white">28/06/2025</TableCell>
                    <TableCell>
                      <Select defaultValue="pendente">
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-600">Cartão</Badge>
                    </TableCell>
                    <TableCell className="text-white">R$ 159,90</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compras" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Pedidos para Fornecedores</CardTitle>
                <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Pedido
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Transportadora</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Selecione a transportadora" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="correios">Correios</SelectItem>
                        <SelectItem value="jadlog">Jadlog</SelectItem>
                        <SelectItem value="total">Total Express</SelectItem>
                        <SelectItem value="mercado">Mercado Envios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Código de Rastreamento</Label>
                    <Input placeholder="Digite o código" className="bg-gray-700 border-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF (se necessário)</Label>
                    <Input placeholder="000.000.000-00" className="bg-gray-700 border-gray-600" />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Pedido</TableHead>
                      <TableHead className="text-gray-300">Fornecedor</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Rastreamento</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white font-mono">#F001</TableCell>
                      <TableCell className="text-white">Fornecedor ABC</TableCell>
                      <TableCell className="text-white">25/06/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">Em Trânsito</Badge>
                      </TableCell>
                      <TableCell className="text-white font-mono">BR123456789</TableCell>
                      <TableCell className="text-white">R$ 1.250,00</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white font-mono">#F002</TableCell>
                      <TableCell className="text-white">Tech Distribuidor</TableCell>
                      <TableCell className="text-white">20/06/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Entregue</Badge>
                      </TableCell>
                      <TableCell className="text-white font-mono">JD987654321</TableCell>
                      <TableCell className="text-white">R$ 890,00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Customers Component
function CustomersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Clientes</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-600 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Exportar Lista
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">1.247</div>
            <p className="text-sm text-gray-400">+18 novos este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">892</div>
            <p className="text-sm text-gray-400">Compraram nos últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">R$ 187,50</div>
            <p className="text-sm text-gray-400">Por cliente ativo</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            <div className="flex space-x-2">
              <Input placeholder="Buscar clientes..." className="bg-gray-700 border-gray-600 w-64" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Telefone</TableHead>
                <TableHead className="text-gray-300">Pedidos</TableHead>
                <TableHead className="text-gray-300">Total Gasto</TableHead>
                <TableHead className="text-gray-300">Último Pedido</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">João Silva</TableCell>
                <TableCell className="text-white">joao@email.com</TableCell>
                <TableCell className="text-white">(11) 99999-9999</TableCell>
                <TableCell className="text-white">5</TableCell>
                <TableCell className="text-white">R$ 1.299,50</TableCell>
                <TableCell className="text-white">25/06/2025</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">Maria Santos</TableCell>
                <TableCell className="text-white">maria@email.com</TableCell>
                <TableCell className="text-white">(11) 88888-8888</TableCell>
                <TableCell className="text-white">3</TableCell>
                <TableCell className="text-white">R$ 567,80</TableCell>
                <TableCell className="text-white">22/06/2025</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">Pedro Costa</TableCell>
                <TableCell className="text-white">pedro@email.com</TableCell>
                <TableCell className="text-white">(11) 77777-7777</TableCell>
                <TableCell className="text-white">8</TableCell>
                <TableCell className="text-white">R$ 2.145,30</TableCell>
                <TableCell className="text-white">28/06/2025</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Financial Component
function FinancialContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">R$ 45.230,00</div>
            <p className="text-sm text-gray-400">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">R$ 12.450,00</div>
            <p className="text-sm text-gray-400">Fornecedores e operacional</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">R$ 32.780,00</div>
            <p className="text-sm text-gray-400">Margem de 72%</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Impostos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">R$ 5.420,00</div>
            <p className="text-sm text-gray-400">12% da receita bruta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Vendas por Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">PIX</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-white font-bold">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Cartão de Crédito</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <span className="text-white font-bold">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Boleto</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <span className="text-white font-bold">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Relatórios e Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-cyan-400 text-black hover:bg-cyan-500">
                <Download className="mr-2 h-4 w-4" />
                Relatório Mensal
              </Button>
              <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Exportar NFe
              </Button>
              <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                Análise de Vendas
              </Button>
              <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                <DollarSign className="mr-2 h-4 w-4" />
                Fluxo de Caixa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-300">Descrição</TableHead>
                <TableHead className="text-gray-300">Método</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">28/06/2025</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Entrada</Badge>
                </TableCell>
                <TableCell className="text-white">Venda #001 - João Silva</TableCell>
                <TableCell className="text-white">PIX</TableCell>
                <TableCell className="text-green-400">+R$ 299,90</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Confirmado</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">27/06/2025</TableCell>
                <TableCell>
                  <Badge className="bg-red-600">Saída</Badge>
                </TableCell>
                <TableCell className="text-white">Compra Fornecedor ABC</TableCell>
                <TableCell className="text-white">Transferência</TableCell>
                <TableCell className="text-red-400">-R$ 1.250,00</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Processado</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">26/06/2025</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Entrada</Badge>
                </TableCell>
                <TableCell className="text-white">Venda #002 - Maria Santos</TableCell>
                <TableCell className="text-white">Cartão</TableCell>
                <TableCell className="text-green-400">+R$ 159,90</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-600">Pendente</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Shipping Component
function ShippingContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Transportadoras</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Configurações de Frete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Correios</h3>
              <div className="space-y-2">
                <Label>CEP de Origem</Label>
                <Input placeholder="00000-000" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Token API</Label>
                <Input placeholder="Token dos Correios" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Input placeholder="Usuário dos Correios" className="bg-gray-700 border-gray-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Jadlog</h3>
              <div className="space-y-2">
                <Label>Código do Cliente</Label>
                <Input placeholder="Código Jadlog" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Token API</Label>
                <Input placeholder="Token Jadlog" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" placeholder="Senha Jadlog" className="bg-gray-700 border-gray-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Total Express</h3>
              <div className="space-y-2">
                <Label>Código do Cliente</Label>
                <Input placeholder="Código Total" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Token API</Label>
                <Input placeholder="Token Total" className="bg-gray-700 border-gray-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Mercado Envios</h3>
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input placeholder="Client ID Mercado Livre" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <Input placeholder="Client Secret" className="bg-gray-700 border-gray-600" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">Salvar Configurações</Button>
            <Button variant="outline" className="border-gray-600 bg-transparent">
              Testar Conexões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Rastreamento de Envios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código de Rastreamento</Label>
                <Input placeholder="Digite o código" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label>Transportadora</Label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="correios">Correios</SelectItem>
                    <SelectItem value="jadlog">Jadlog</SelectItem>
                    <SelectItem value="total">Total Express</SelectItem>
                    <SelectItem value="mercado">Mercado Envios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">Rastrear Envio</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Banners Component
function BannersContent() {
  const [showAddBanner, setShowAddBanner] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Banners</h2>
        <Dialog open={showAddBanner} onOpenChange={setShowAddBanner}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Banner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="banner-title">Título do Banner</Label>
                <Input id="banner-title" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-link">Link (opcional)</Label>
                <Input id="banner-link" placeholder="https://..." className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-image">Imagem</Label>
                <Input id="banner-image" type="file" accept="image/*" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-order">Ordem de Exibição</Label>
                <Input id="banner-order" type="number" defaultValue="1" className="bg-gray-700 border-gray-600" />
              </div>
              <div className="flex space-x-2">
                <Button className="bg-cyan-400 text-black hover:bg-cyan-500 flex-1">Salvar Banner</Button>
                <Button variant="outline" onClick={() => setShowAddBanner(false)} className="border-gray-600">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Banners Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <img
                src="/placeholder.svg?height=150&width=300"
                alt="Banner"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-medium">Banner Principal</span>
                <Badge className="bg-green-600">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Ordem: 1</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <img
                src="/placeholder.svg?height=150&width=300"
                alt="Banner"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-medium">Promoção Vapes</span>
                <Badge className="bg-green-600">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Ordem: 2</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <img
                src="/placeholder.svg?height=150&width=300"
                alt="Banner"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-medium">Lançamentos</span>
                <Badge className="bg-yellow-600">Pausado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Ordem: 3</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Component
function SettingsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Configurações</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Informações da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Loja</Label>
              <Input defaultValue="Vlar" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="contato@vlar.com" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input defaultValue="(11) 99999-9999" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input defaultValue="00.000.000/0001-00" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Textarea defaultValue="Rua Example, 123 - São Paulo, SP" className="bg-gray-700 border-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Frete Grátis a partir de (R$)</Label>
              <Input defaultValue="299" type="number" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input defaultValue="5511999999999" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Horário de Funcionamento</Label>
              <Input defaultValue="Segunda a Sexta: 9h às 18h" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select defaultValue="BRL">
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Backup e Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
                <Download className="mr-2 h-4 w-4" />
                Fazer Backup
              </Button>
              <Button variant="outline" className="border-gray-600 bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Restaurar Backup
              </Button>
            </div>
            <div className="text-sm text-gray-400">Último backup: 27/06/2025 às 14:30</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email para Notificações</Label>
              <Input defaultValue="admin@vlar.com" className="bg-gray-700 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input placeholder="https://..." className="bg-gray-700 border-gray-600" />
            </div>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">Salvar Configurações</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
