"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    whatsapp: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
        setFormData({ name: "", surname: "", email: "", whatsapp: "", message: "" })
      } else {
        alert("Erro ao enviar mensagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappLink = `https://wa.me/5533998343132?text=Olá! Gostaria de mais informações sobre os produtos da Vlar.`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Entre em Contato
            </h1>
            <p className="text-gray-300 text-lg">Estamos aqui para ajudar! Entre em contato conosco.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Envie sua Mensagem</CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha o formulário abaixo e entraremos em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sobrenome *</label>
                      <Input
                        required
                        value={formData.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descreva o problema *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                      placeholder="Descreva detalhadamente sua dúvida ou problema..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Outras formas de contato</h3>

                  <div className="space-y-4">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Phone className="h-5 w-5 text-white mr-3" />
                      <div>
                        <p className="text-white font-medium">WhatsApp</p>
                        <p className="text-green-100 text-sm">Clique para conversar</p>
                      </div>
                    </a>

                    <a
                      href="mailto:vlartech@gmail.com"
                      className="flex items-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Mail className="h-5 w-5 text-white mr-3" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-blue-100 text-sm">vlartech@gmail.com</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Horário de Atendimento</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Segunda a Sexta:</strong> 8h às 18h
                    </p>
                    <p>
                      <strong>Sábado:</strong> 8h às 12h
                    </p>
                    <p>
                      <strong>Domingo:</strong> Fechado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
