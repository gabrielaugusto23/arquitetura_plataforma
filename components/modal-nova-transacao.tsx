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
  TIPOS_TRANSACAO,
  STATUS_VENDA,
  type TipoTransacao,
  type DadosTransacao,
} from "@/types/venda"

interface ModalNovaTransacaoProps {
  aberto: boolean
  aoFechar: () => void
  aoEnviar: (dados: DadosTransacao) => Promise<void>
}

export function ModalNovaTransacao({ aberto, aoFechar, aoEnviar }: ModalNovaTransacaoProps) {
  const { toast } = useToast()
  const [carregando, setCarregando] = useState(false)
  const [arquivoPDF, setArquivoPDF] = useState<File | null>(null)

  const obterDataHoraFormatada = () => {
    const agora = new Date()
    const dia = String(agora.getDate()).padStart(2, '0')
    const mes = String(agora.getMonth() + 1).padStart(2, '0')
    const ano = agora.getFullYear()
    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`
  }

  const [dados, setDados] = useState<DadosTransacao>({
    idVenda: "",
    tipoTransacao: "PIX",
    valorTransacao: 0,
    dataTransacao: new Date().toISOString(),
    quemRealizou: "",
    statusTransacao: "Pendente",
    descricao: "",
    arquivoPDF: undefined,
  })

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (arquivo) {
      if (!arquivo.name.endsWith(".pdf")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato PDF",
          variant: "destructive",
        })
        return
      }

      if (arquivo.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        })
        return
      }

      setArquivoPDF(arquivo)
      setDados({
        ...dados,
        arquivoPDF: arquivo,
      })
    }
  }

  const handleRemoverArquivo = () => {
    setArquivoPDF(null)
    setDados({
      ...dados,
      arquivoPDF: undefined,
    })
  }

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.idVenda.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione a venda associada",
        variant: "destructive",
      })
      return
    }

    if (!dados.quemRealizou.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha quem realizou a transacao",
        variant: "destructive",
      })
      return
    }

    if (dados.valorTransacao <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor da transacao deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    setCarregando(true)

    try {
      await aoEnviar(dados)

      setDados({
        idVenda: "",
        tipoTransacao: "PIX",
        valorTransacao: 0,
        dataTransacao: new Date().toISOString(),
        quemRealizou: "",
        statusTransacao: "Pendente",
        descricao: "",
        arquivoPDF: undefined,
      })
      setArquivoPDF(null)
      aoFechar()
    } catch (erro) {
      toast({
        title: "Erro ao criar transacao",
        description: "Ocorreu um erro ao criar a transacao. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao criar transacao:", erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Transacao</DialogTitle>
          <DialogDescription className="text-gray-400">
            Registre uma nova transacao de venda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnviar} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="idVenda" className="text-xs text-gray-400">
              Venda Associada
            </Label>
            <Input
              id="idVenda"
              placeholder="Ex: VND-001"
              value={dados.idVenda}
              onChange={(e) => setDados({ ...dados, idVenda: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tipoTransacao" className="text-xs text-gray-400">
              Tipo de Transacao
            </Label>
            <Select value={dados.tipoTransacao} onValueChange={(tipo) => setDados({ ...dados, tipoTransacao: tipo as TipoTransacao })}>
              <SelectTrigger className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                {TIPOS_TRANSACAO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo} className="text-xs">
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="valorTransacao" className="text-xs text-gray-400">
              Valor da Transacao (R$)
            </Label>
            <Input
              id="valorTransacao"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 5000.00"
              value={dados.valorTransacao || ""}
              onChange={(e) => setDados({ ...dados, valorTransacao: parseFloat(e.target.value) || 0 })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="quemRealizou" className="text-xs text-gray-400">
              Quem Realizou a Transacao
            </Label>
            <Input
              id="quemRealizou"
              placeholder="Ex: João Silva"
              value={dados.quemRealizou}
              onChange={(e) => setDados({ ...dados, quemRealizou: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dataTransacao" className="text-xs text-gray-400">
              Data e Hora
            </Label>
            <Input
              id="dataTransacao"
              type="text"
              value={obterDataHoraFormatada()}
              readOnly
              className="h-8 border-gray-800 bg-gray-950 text-xs text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="statusTransacao" className="text-xs text-gray-400">
              Status
            </Label>
            <Select value={dados.statusTransacao} onValueChange={(status) => setDados({ ...dados, statusTransacao: status as any })}>
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
              placeholder="Descreva detalhes da transacao..."
              value={dados.descricao}
              onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              className="min-h-[60px] border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="arquivoPDF" className="text-xs text-gray-400">
              Documento PDF da Transacao (opcional)
            </Label>
            {!arquivoPDF ? (
              <label className="relative block cursor-pointer rounded-lg border border-dashed border-gray-800 bg-gray-950 p-2 text-center transition hover:border-orange-500/50">
                <input
                  id="arquivoPDF"
                  type="file"
                  accept=".pdf"
                  onChange={handleSelecionarArquivo}
                  className="hidden"
                />
                <Upload className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                <p className="text-xs text-gray-300">
                  Clique para selecionar arquivo PDF
                </p>
                <p className="mt-0.5 text-xs text-gray-600">Máximo 5MB</p>
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-2">
                <span className="text-xs text-gray-300">{arquivoPDF.name}</span>
                <button
                  type="button"
                  onClick={handleRemoverArquivo}
                  className="text-gray-500 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
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
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              disabled={carregando}
            >
              {carregando ? "Criando" : "Criar Transacao"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
