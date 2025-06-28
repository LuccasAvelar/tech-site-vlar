"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Banner } from "@/types"
import Image from "next/image"

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    isActive: true,
    sortOrder: 0,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners")
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error("Erro ao carregar banners:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : "/api/banners"
      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchBanners()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Erro ao salvar banner:", error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || "",
      image: banner.image,
      link: banner.link || "",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (bannerId: string) => {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      try {
        await fetch(`/api/banners/${bannerId}`, { method: "DELETE" })
        fetchBanners()
      } catch (error) {
        console.error("Erro ao excluir banner:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      link: "",
      isActive: true,
      sortOrder: 0,
    })
    setEditingBanner(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Banners</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título (opcional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Título do banner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://exemplo.com/banner.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (opcional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://exemplo.com/produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Ordem</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number.parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
                >
                  {editingBanner ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="relative aspect-video mb-4">
                  <Image
                    src={banner.image || "/placeholder.svg?height=200&width=400"}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <CardTitle className="text-white text-lg">{banner.title || `Banner ${banner.sortOrder + 1}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm ${banner.isActive ? "text-green-400" : "text-red-400"}`}>
                    {banner.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <span className="text-gray-300 text-sm">Ordem: {banner.sortOrder}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(banner)}
                    className="flex-1 border-gray-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(banner.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
