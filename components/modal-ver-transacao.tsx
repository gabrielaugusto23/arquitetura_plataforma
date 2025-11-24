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
import { useAppContext } from "@/app/context/AppContext"
import { Transacao } from "@/types/venda"

interface ModalVerTransacaoProps {
  aberto: boolean
  aoFechar: () => void
  transacao: Transacao
  aoSalvarEdicao?: (id: string, dados: any) => void
}

export function ModalVerTransacao({
  aberto,
  aoFechar,
  transacao,
  aoSalvarEdicao,
}: ModalVerTransacaoProps) {
  const { addNotification } = useAppContext()
  const [emEdicao, setEmEdicao] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [dados, setDados] = useState({
    tipoTransacao: "",
    valorTransacao: 0,
    quemRealizou: "",
    descricao: "",
    statusTransacao: "Pendente",
  })

  useEffect(() => {
    if (aberto && transacao) {
      setDados({
        tipoTransacao: transacao.tipoTransacao,
        valorTransacao: transacao.valorTransacao,
        quemRealizou: transacao.quemRealizou,
        descricao: transacao.descricao || "",
        statusTransacao: transacao.statusTransacao,
      })
      setEmEdicao(false)
    }
  }, [aberto, transacao])

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Pendente":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      case "Falha":
        return "bg-red-500/15 text-red-400 border-red-500/20"
      default:
        return ""
    }
  }

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.tipoTransacao.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o tipo de transação"
      })
      return
    }

    if (!dados.quemRealizou.trim()) {
      addNotification({
        type: "error",
        message: "Preencha quem realizou a transação"
      })
      return
    }

    if (dados.valorTransacao <= 0) {
      addNotification({
        type: "error",
        message: "O valor deve ser maior que zero"
      })
      return
    }

    setCarregando(true)

    try {
      if (aoSalvarEdicao) {
        aoSalvarEdicao(transacao.id, dados)
      }

      addNotification({
        type: "success",
        message: "Transação atualizada com sucesso"
      })

      setEmEdicao(false)
      aoFechar()
    } catch (erro) {
      addNotification({
        type: "error",
        message: "Erro ao atualizar transação"
      })
      console.error("Erro ao atualizar transação:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const formatarData = (data: string | Date) => {
    const dataObj = typeof data === 'string' ? new Date(data) : data
    return dataObj.toLocaleDateString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2)}`
  }

  if (!transacao) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-white">
              {emEdicao ? "Editar Transação" : "Detalhes da Transação"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {emEdicao
                ? "Altere as informações da transação"
                : "Visualize e gerencie esta transação"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {emEdicao ? (
          <form onSubmit={handleSalvarEdicao} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="tipoTransacao" className="text-xs text-gray-400">
                Tipo de Transação
              </Label>
              <Select value={dados.tipoTransacao} onValueChange={(tipo) => setDados({ ...dados, tipoTransacao: tipo })}>
                <SelectTrigger className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  <SelectItem value="Boleto" className="text-xs">Boleto</SelectItem>
                  <SelectItem value="PIX" className="text-xs">PIX</SelectItem>
                  <SelectItem value="Transferencia" className="text-xs">Transferência</SelectItem>
                  <SelectItem value="Cartao Credito" className="text-xs">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartao Debito" className="text-xs">Cartão de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="valorTransacao" className="text-xs text-gray-400">
                Valor (R$)
              </Label>
              <Input
                id="valorTransacao"
                type="number"
                step="0.01"
                min="0"
                value={dados.valorTransacao || ""}
                onChange={(e) => setDados({ ...dados, valorTransacao: parseFloat(e.target.value) || 0 })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="quemRealizou" className="text-xs text-gray-400">
                Quem Realizou
              </Label>
              <Input
                id="quemRealizou"
                value={dados.quemRealizou}
                onChange={(e) => setDados({ ...dados, quemRealizou: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="statusTransacao" className="text-xs text-gray-400">
                Status
              </Label>
              <Select value={dados.statusTransacao} onValueChange={(status) => setDados({ ...dados, statusTransacao: status })}>
                <SelectTrigger className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  <SelectItem value="Confirmada" className="text-xs">Confirmada</SelectItem>
                  <SelectItem value="Pendente" className="text-xs">Pendente</SelectItem>
                  <SelectItem value="Falha" className="text-xs">Falha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="descricao" className="text-xs text-gray-400">
                Descrição
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
                <p className="text-xs text-gray-500">Número da Transação</p>
                <p className="text-xs font-medium text-white">{transacao.numeroTransacao}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">ID Venda</p>
                  <p className="text-xs text-gray-300">VND-{transacao.idVenda}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-xs text-gray-300">{transacao.tipoTransacao}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="text-xs font-medium text-green-400">{formatarValor(transacao.valorTransacao)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getBadgeVariant(transacao.statusTransacao)}>
                    {transacao.statusTransacao}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Quem Realizou</p>
                  <p className="text-xs text-gray-300">{transacao.quemRealizou}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data Transação</p>
                  <p className="text-xs text-gray-300">{formatarData(transacao.dataTransacao)}</p>
                </div>
              </div>

              {transacao.descricao && (
                <div>
                  <p className="text-xs text-gray-500">Descrição</p>
                  <p className="text-xs text-gray-300">{transacao.descricao}</p>
                </div>
              )}

              {transacao.arquivoPDF && (
                <div>
                  <p className="text-xs text-gray-500">Arquivo PDF</p>
                  <p className="text-xs text-orange-400 cursor-pointer hover:underline">{transacao.arquivoPDF}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 border-t border-gray-700 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Criação</p>
                  <p className="text-xs text-gray-300">{formatarData(transacao.dataCriacao)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Atualização</p>
                  <p className="text-xs text-gray-300">{formatarData(transacao.ultimaAtualizacao)}</p>
                </div>
              </div>
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
