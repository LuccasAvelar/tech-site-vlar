"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { User, Lock, Save } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const [saving, setSaving] = useState(false)

  // Dados pessoais
  const [personalData, setPersonalData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  })

  // Dados de segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    if (user) {
      setPersonalData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
      })
    }
  }, [user, loading, router])

  const handlePersonalDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Dados pessoais atualizados com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar dados pessoais.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (securityData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...personalData,
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Senha alterada com sucesso.",
        })
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao alterar senha.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
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
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
            <p className="text-gray-400 mt-2">Gerencie suas informações pessoais e configurações de segurança</p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger value="personal" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <User className="h-4 w-4 mr-2" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                <Lock className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Atualize suas informações pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePersonalDataSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={personalData.name}
                          onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={personalData.phone}
                          onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-white">
                          Endereço
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          value={personalData.address}
                          onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Rua, número, complemento"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">
                          Cidade
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          value={personalData.city}
                          onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">
                          Estado
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          value={personalData.state}
                          onChange={(e) => setPersonalData({ ...personalData, state: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="MG"
                          maxLength={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zip_code" className="text-white">
                          CEP
                        </Label>
                        <Input
                          id="zip_code"
                          type="text"
                          value={personalData.zip_code}
                          onChange={(e) => setPersonalData({ ...personalData, zip_code: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Segurança da Conta</CardTitle>
                  <CardDescription className="text-gray-400">
                    Altere sua senha para manter sua conta segura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-white">
                        Senha Atual
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-white">
                        Nova Senha
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        minLength={6}
                        required
                      />
                      <p className="text-gray-400 text-sm">A senha deve ter pelo menos 6 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {saving ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
