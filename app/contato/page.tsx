"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao enviar mensagem.",
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
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Entre em Contato
            </h1>
            <p className="text-gray-400 text-lg">
              Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações de Contato */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-cyan-400" />
                    Telefone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">(33) 99834-3132</p>
                  <p className="text-gray-400 text-sm mt-1">WhatsApp disponível</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-cyan-400" />
                    E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">contato@vlar.com</p>
                  <p className="text-gray-400 text-sm mt-1">Respondemos em até 24h</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Minas Gerais, Brasil</p>
                  <p className="text-gray-400 text-sm mt-1">Atendimento online</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                    Horário de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-gray-300">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                    <p className="text-gray-400 text-sm">Domingo: Fechado</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Envie sua Mensagem</CardTitle>
                  <CardDescription className="text-gray-400">
                    Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Nome Completo *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          E-mail *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
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
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white">
                          Assunto *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">
                        Mensagem *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                        placeholder="Descreva sua dúvida ou solicitação..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-medium"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
