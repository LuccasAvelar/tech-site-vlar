"use client"
import { useState, useEffect } from "react"
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
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AdminERPPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Verificação de acesso admin
  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/404")
      return
    }

    fetchData()
  }, [user, isAdmin, router])

  const fetchData = async () => {
    try {
      // Simular carregamento de dados
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setIsLoading(false)
    }
  }

  if (!user || !isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
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
              Admin
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Ver Site
            </Button>
            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black bg-transparent"
            >
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
      <h2 className="text-3xl font-bold">Dashboard</h2>

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
              </TableRow>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">#002</TableCell>
                <TableCell className="text-white">Maria Santos</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-600">Pendente</Badge>
                </TableCell>
                <TableCell className="text-white">R$ 159,90</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Products Component
function ProductsContent() {
  const [showAddProduct, setShowAddProduct] = useState(false)

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input id="price" type="number" step="0.01" className="bg-gray-700 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input id="stock" type="number" className="bg-gray-700 border-gray-600" />
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

              <Button className="bg-cyan-400 text-black hover:bg-cyan-500">Salvar Produto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Lista de Produtos</CardTitle>
            <div className="flex space-x-2">
              <Input placeholder="Buscar produtos..." className="bg-gray-700 border-gray-600 w-64" />
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
                <TableHead className="text-gray-300">Produto</TableHead>
                <TableHead className="text-gray-300">Categoria</TableHead>
                <TableHead className="text-gray-300">Preço</TableHead>
                <TableHead className="text-gray-300">Estoque</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-700">
                <TableCell className="text-white">Vape Pod Descartável</TableCell>
                <TableCell className="text-white">Vaporizadores</TableCell>
                <TableCell className="text-white">R$ 29,90</TableCell>
                <TableCell className="text-white">45</TableCell>
                <TableCell>
                  <Badge className="bg-green-600">Ativo</Badge>
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
              <CardTitle className="text-white">Pedidos de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Pedido</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-white">#001</TableCell>
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
                    <TableCell className="text-white">R$ 299,90</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
                <div className="grid grid-cols-2 gap-4">
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Código de Rastreamento</Label>
                    <Input placeholder="Digite o código" className="bg-gray-700 border-gray-600" />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Pedido</TableHead>
                      <TableHead className="text-gray-300">Fornecedor</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Rastreamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white">#F001</TableCell>
                      <TableCell className="text-white">Fornecedor ABC</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">Em Trânsito</Badge>
                      </TableCell>
                      <TableCell className="text-white">BR123456789</TableCell>
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
      <h2 className="text-3xl font-bold">Clientes</h2>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="text-white font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Cartão de Crédito</span>
                <span className="text-white font-bold">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Boleto</span>
                <span className="text-white font-bold">20%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Notas Fiscais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-cyan-400 text-black hover:bg-cyan-500">
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório Mensal
              </Button>
              <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Exportar NFe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
            </div>
          </div>

          <div className="mt-6">
            <Button className="bg-cyan-400 text-black hover:bg-cyan-500">Salvar Configurações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Banners Component
function BannersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Banners</h2>
        <Button className="bg-cyan-400 text-black hover:bg-cyan-500">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Banner
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Banners Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <img src="/placeholder.svg" alt="Banner" className="w-full h-32 object-cover rounded mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">Banner Principal</span>
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
              <Label>Frete Grátis a partir de</Label>
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
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Backup e Segurança</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
