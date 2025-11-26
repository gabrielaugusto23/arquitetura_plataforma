"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useAppContext } from "@/app/context/AppContext"
import { Loader2, Pencil, Save, X } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ModalVerReembolsoProps {
  aberto: boolean
  aoFechar: () => void
  reembolso: any
  aoSalvar: (reembolso: any) => void
}

export function ModalVerReembolso({ aberto, aoFechar, reembolso, aoSalvar }: ModalVerReembolsoProps) {
  const { addNotification, userInfo } = useAppContext()
  const [dados, setDados] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAdmin = userInfo?.role && userInfo.role.toUpperCase() === 'ADMIN';

  useEffect(() => {
    if (reembolso) {
      const valorCorreto = reembolso.valor ?? reembolso.valorReembolso ?? 0
      const dataCorreta = reembolso.dataDespesa ?? reembolso.dataReembolso
      
      setDados({
        ...reembolso,
        valor: valorCorreto,
        dataDespesa: dataCorreta ? dataCorreta.split('T')[0] : ''
      })
    }
    setIsEditing(false) 
  }, [reembolso, aberto])

  if (!dados) return null

  const handleChange = (field: string, value: any) => {
    setDados((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('engnet_token')
      
      const payload = {
        categoria: dados.categoria,
        descricao: dados.descricao,
        justificativa: dados.justificativa,
        valor: Number(dados.valor),
        dataDespesa: dados.dataDespesa,
      }

      const res = await fetch(`${API_URL}/reembolsos/${dados.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Erro ao atualizar")

      addNotification({ type: "success", message: "Alterações salvas com sucesso!" })
      aoSalvar(dados) 
      setIsEditing(false)
    } catch (error) {
      addNotification({ type: "error", message: "Não foi possível salvar as alterações." })
    } finally {
      setLoading(false)
    }
  }

  const formatarValorDisplay = (v: any) => {
    const numero = Number(v)
    if (isNaN(numero)) return "R$ 0,00"
    return `R$ ${numero.toFixed(2).replace(".", ",")}`
  }

  const nomeFuncionario = dados.usuario?.nome ?? dados.nomeFuncionario ?? "Desconhecido"

  const getBadgeVariant = (status: string) => {
    const s = status ? status.toLowerCase() : ''
    if (s === 'aprovado') return "bg-green-500/15 text-green-400 border-green-500/30"
    if (s === 'rejeitado') return "bg-red-500/15 text-red-400 border-red-500/30"
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
  }

  return (
    <Dialog open={aberto} onOpenChange={(v) => {
      if (!v) {
        setIsEditing(false)
        aoFechar()
      }
    }}>
      <DialogContent className="bg-black border-gray-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isEditing ? "Editar Reembolso" : "Detalhes do Reembolso"}</DialogTitle>
            <Badge className={`mr-8 ${getBadgeVariant(dados.status)}`}>
              {dados.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Funcionário</Label>
              <Input value={nomeFuncionario} disabled className="bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Data da Despesa</Label>
              <Input 
                type="date"
                value={dados.dataDespesa} 
                disabled={!isEditing} 
                onChange={(e) => handleChange('dataDespesa', e.target.value)}
                className={`border-gray-800 ${isEditing ? 'bg-gray-950 text-white' : 'bg-gray-900 text-gray-400'}`} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Categoria</Label>
              {isEditing ? (
                <Select value={dados.categoria} onValueChange={(v) => handleChange('categoria', v)}>
                  <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-black text-gray-200">
                    <SelectItem value="Combustível">Combustível</SelectItem>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                    <SelectItem value="Material de Escritório">Material</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={dados.categoria} disabled className="bg-gray-900 border-gray-800 text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Valor (R$)</Label>
              {isEditing ? (
                <Input 
                  type="number"
                  step="0.01"
                  value={dados.valor} 
                  onChange={(e) => handleChange('valor', e.target.value)}
                  className="bg-gray-950 border-gray-800 text-white" 
                />
              ) : (
                <Input 
                  value={formatarValorDisplay(dados.valor)} 
                  disabled 
                  className="bg-gray-900 border-gray-800 font-bold text-green-400" 
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Descrição</Label>
            <Textarea 
              value={dados.descricao} 
              disabled={!isEditing} 
              onChange={(e) => handleChange('descricao', e.target.value)}
              className={`border-gray-800 min-h-[80px] ${isEditing ? 'bg-gray-950 text-white' : 'bg-gray-900 text-gray-400'}`}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Justificativa Comercial</Label>
            <Textarea 
              value={dados.justificativa || ''} 
              disabled={!isEditing} 
              onChange={(e) => handleChange('justificativa', e.target.value)}
              className={`border-gray-800 min-h-[60px] ${isEditing ? 'bg-gray-950 text-white' : 'bg-gray-900 text-gray-400'}`}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={aoFechar} className="border-gray-800 text-gray-300 hover:bg-gray-900">
                Fechar
              </Button>
              {isAdmin && (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                  <Pencil className="h-4 w-4" /> Editar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsEditing(false)
                  setDados(reembolso) 
                }} 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
              >
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Alterações
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}