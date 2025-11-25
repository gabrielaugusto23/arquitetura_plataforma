"use client"

import { useState, useEffect } from "react"
import { Edit2, X } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  CATEGORIAS_VENDA,
  STATUS_VENDA,
  type CategoriaVenda,
  type DadosVenda,
  type Venda,
} from "@/types/venda"

interface ModalVerVendaProps {
  aberto: boolean
  aoFechar: () => void
  venda: Venda | null
  aoSalvarEdicao: (vendaId: string, dados: DadosVenda) => Promise<void>
}

export function ModalVerVenda({
  aberto,
  aoFechar,
  venda,
  aoSalvarEdicao,
}: ModalVerVendaProps) {
  const { toast } = useToast()
  const [emEdicao, setEmEdicao] = useState(false)
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

  useEffect(() => {
    if (aberto && venda) {
      const dataHoraAtual = new Date().toISOString()
      setDados({
        nomeVendedor: venda.nomeVendedor,
        categoria: venda.categoria,
        valorVenda: venda.valorVenda,
        dataVenda: dataHoraAtual,
        status: venda.status,
        cliente: venda.cliente,
        descricao: venda.descricao || "",
      })
      setEmEdicao(false)
    }
  }, [aberto, venda])

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Concluida":
        return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Pendente":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      case "Cancelada":
        return "bg-red-500/15 text-red-400 border-red-500/20"
      case "Processando":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20"
      default:
        return ""
    }
  }

  const handleSalvarEdicao = async (e: React.FormEvent) => {
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

    if (!venda) return

    setCarregando(true)

    try {
      await aoSalvarEdicao(venda.id, dados)

      toast({
        title: "Venda atualizada",
        description: "Suas alteracoes foram salvas com sucesso",
      })

      setEmEdicao(false)
      aoFechar()
    } catch (erro) {
      toast({
        title: "Erro ao atualizar venda",
        description: "Ocorreu um erro ao atualizar a venda. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao atualizar venda:", erro)
    } finally {
      setCarregando(false)
    }
  }

  if (!venda) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-white">
              {emEdicao ? "Editar Venda" : "Detalhes da Venda"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {emEdicao
                ? "Altere as informacoes da venda"
                : "Visualize e gerencie esta venda"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {emEdicao ? (
          <form onSubmit={handleSalvarEdicao} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="nomeVendedor" className="text-xs text-gray-400">
                Nome do Vendedor
              </Label>
              <Input
                id="nomeVendedor"
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
                value={dados.cliente}
                onChange={(e) => setDados({ ...dados, cliente: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="categoria" className="text-xs text-gray-400">
                Categoria
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
                Descricao
              </Label>
              <Textarea
                id="descricao"
                value={dados.descricao}
                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                className="min-h-[60px] border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmEdicao(false)}
                className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
                disabled={carregando}
              >
                {carregando ? "Salvando" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-950 p-3">
              <div>
                <p className="text-xs text-gray-500">Número da Venda</p>
                <p className="text-xs font-medium text-white">{venda.numeroVenda}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Vendedor</p>
                  <p className="text-xs text-gray-300">{venda.nomeVendedor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="text-xs text-gray-300">{venda.cliente}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Categoria</p>
                  <p className="text-xs text-gray-300">{venda.categoria}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getBadgeVariant(venda.status)}>
                    {venda.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Valor da Venda</p>
                <p className="text-xs font-medium text-green-400">R$ {venda.valorVenda.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Data da Venda</p>
                <p className="text-xs text-gray-300">{new Date(venda.dataVenda).toLocaleString("pt-BR")}</p>
              </div>

              {venda.descricao && (
                <div>
                  <p className="text-xs text-gray-500">Descricao</p>
                  <p className="text-xs text-gray-300">{venda.descricao}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={aoFechar}
                className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => setEmEdicao(true)}
                className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Editar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
