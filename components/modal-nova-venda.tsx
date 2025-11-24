"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  CATEGORIAS_VENDA,
  STATUS_VENDA,
  type CategoriaVenda,
  type DadosVenda,
} from "@/types/venda"

interface ModalNovaVendaProps {
  aberto: boolean
  aoFechar: () => void
  aoEnviar: (dados: DadosVenda) => Promise<void>
}

export function ModalNovaVenda({ aberto, aoFechar, aoEnviar }: ModalNovaVendaProps) {
  const { toast } = useToast()
  const [carregando, setCarregando] = useState(false)

  const obterDataHoraFormatada = () => {
    const agora = new Date()
    const dia = String(agora.getDate()).padStart(2, '0')
    const mes = String(agora.getMonth() + 1).padStart(2, '0')
    const ano = agora.getFullYear()
    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`
  }

  const [dados, setDados] = useState<DadosVenda>({
    nomeVendedor: "",
    categoria: "Serviços Consultoria",
    valorVenda: 0,
    dataVenda: new Date().toISOString(),
    status: "Pendente",
    cliente: "",
    descricao: "",
  })

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.nomeVendedor.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome do vendedor",
        variant: "destructive",
      })
      return
    }

    if (!dados.cliente.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome do cliente",
        variant: "destructive",
      })
      return
    }

    if (dados.valorVenda <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor da venda deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    setCarregando(true)

    try {
      await aoEnviar(dados)

      setDados({
        nomeVendedor: "",
        categoria: "Serviços Consultoria",
        valorVenda: 0,
        dataVenda: new Date().toISOString(),
        status: "Pendente",
        cliente: "",
        descricao: "",
      })
      aoFechar()
    } catch (erro) {
      toast({
        title: "Erro ao criar venda",
        description: "Ocorreu um erro ao criar a venda. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao criar venda:", erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informacoes para registrar uma nova venda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnviar} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="nomeVendedor" className="text-xs text-gray-400">
              Nome do Vendedor
            </Label>
            <Input
              id="nomeVendedor"
              placeholder="Ex: João Silva"
              value={dados.nomeVendedor}
              onChange={(e) => setDados({ ...dados, nomeVendedor: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cliente" className="text-xs text-gray-400">
              Nome do Cliente
            </Label>
            <Input
              id="cliente"
              placeholder="Ex: Empresa ABC"
              value={dados.cliente}
              onChange={(e) => setDados({ ...dados, cliente: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="categoria" className="text-xs text-gray-400">
              Categoria de Venda
            </Label>
            <Select value={dados.categoria} onValueChange={(cat) => setDados({ ...dados, categoria: cat as CategoriaVenda })}>
              <SelectTrigger className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                {CATEGORIAS_VENDA.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="valorVenda" className="text-xs text-gray-400">
              Valor da Venda (R$)
            </Label>
            <Input
              id="valorVenda"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 5000.00"
              value={dados.valorVenda || ""}
              onChange={(e) => setDados({ ...dados, valorVenda: parseFloat(e.target.value) || 0 })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dataVenda" className="text-xs text-gray-400">
              Data e Hora
            </Label>
            <Input
              id="dataVenda"
              type="text"
              value={obterDataHoraFormatada()}
              readOnly
              className="h-8 border-gray-800 bg-gray-950 text-xs text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="status" className="text-xs text-gray-400">
              Status
            </Label>
            <Select value={dados.status} onValueChange={(status) => setDados({ ...dados, status: status as any })}>
              <SelectTrigger className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                {STATUS_VENDA.map((status) => (
                  <SelectItem key={status} value={status} className="text-xs">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao" className="text-xs text-gray-400">
              Descricao (opcional)
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva detalhes da venda..."
              value={dados.descricao}
              onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              className="min-h-[60px] border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
            />
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={aoFechar}
              className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              disabled={carregando}
            >
              {carregando ? "Criando" : "Criar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
