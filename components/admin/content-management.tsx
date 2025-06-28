"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Edit, Type, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentItem {
  id: string
  key: string
  value: string
  type: "text" | "textarea" | "image"
  label: string
  description?: string
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error)
    }
  }

  const updateContent = async (key: string, value: string) => {
    setIsLoading(true)
    try {
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })

      setContent((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)))
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (item: ContentItem, newValue: string) => {
    await updateContent(item.key, newValue)
  }

  const textContent = content.filter((item) => item.type === "text")
  const textareaContent = content.filter((item) => item.type === "textarea")
  const imageContent = content.filter((item) => item.type === "image")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Gerenciar Conteúdo</h2>
        <p className="text-gray-400">Edite textos, botões e imagens do site</p>
      </div>

      <Tabs defaultValue="texts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="texts" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
            <Type className="h-4 w-4 mr-2" />
            Textos
          </TabsTrigger>
          <TabsTrigger value="descriptions" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
            <Edit className="h-4 w-4 mr-2" />
            Descrições
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
            <ImageIcon className="h-4 w-4 mr-2" />
            Imagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="texts" className="space-y-4">
          {textContent.map((item) => (
            <ContentEditor key={item.id} item={item} onSave={handleSave} isLoading={isLoading} />
          ))}
        </TabsContent>

        <TabsContent value="descriptions" className="space-y-4">
          {textareaContent.map((item) => (
            <ContentEditor key={item.id} item={item} onSave={handleSave} isLoading={isLoading} />
          ))}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          {imageContent.map((item) => (
            <ContentEditor key={item.id} item={item} onSave={handleSave} isLoading={isLoading} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ContentEditorProps {
  item: ContentItem
  onSave: (item: ContentItem, value: string) => Promise<void>
  isLoading: boolean
}

function ContentEditor({ item, onSave, isLoading }: ContentEditorProps) {
  const [value, setValue] = useState(item.value)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    await onSave(item, value)
    setIsEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">{item.label}</CardTitle>
          {item.description && <CardDescription className="text-gray-400">{item.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              {item.type === "textarea" ? (
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              )}
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setValue(item.value)
                    setIsEditing(false)
                  }}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-700 p-3 rounded border border-gray-600">
                <p className="text-white">{item.value}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="border-gray-600">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
