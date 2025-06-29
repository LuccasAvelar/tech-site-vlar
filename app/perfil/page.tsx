"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/header"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  birthDate?: string
  avatar?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: string
}

export default function PerfilPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Dados de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (response.ok) {
        setProfile(data.user)
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          birthDate: data.user.birthDate || "",
          address: data.user.address || "",
          city: data.user.city || "",
          state: data.user.state || "",
          zipCode: data.user.zipCode || "",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Perfil atualizado com sucesso",
        })
        setEditMode(false)
        fetchProfile()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao atualizar perfil",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Senha alterada com sucesso",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao alterar senha",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-300">Faça login para acessar seu perfil</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Meu Perfil
            </h1>
            <p className="text-gray-300">Gerencie suas informações pessoais</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:text-white">
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger value="security" className="text-gray-300 data-[state=active]:text-white">
                  Segurança
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Informações Pessoais</CardTitle>
                        <CardDescription className="text-gray-400">Atualize suas informações pessoais</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(!editMode)}
                        className="border-gray-600 bg-transparent text-gray-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {editMode ? "Cancelar" : "Editar"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profile?.email || ""}
                          disabled
                          className="bg-gray-700 border-gray-600 text-white opacity-50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-gray-300">
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div>
                        <Label htmlFor="birthDate" className="text-gray-300">
                          Data de Nascimento
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address" className="text-gray-300">
                          Endereço
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                          placeholder="Rua, número, complemento"
                        />
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-gray-300">
                          Cidade
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-gray-300">
                          Estado
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                          placeholder="MG"
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode" className="text-gray-300">
                          CEP
                        </Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          disabled={!editMode}
                          className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(false)}
                          className="border-gray-600 bg-transparent text-gray-300"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Alterar Senha</CardTitle>
                    <CardDescription className="text-gray-400">
                      Mantenha sua conta segura alterando sua senha regularmente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-gray-300">
                        Senha Atual
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-gray-300">
                        Nova Senha
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-300">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {saving ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
