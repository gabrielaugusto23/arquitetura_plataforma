"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Reembolso, DadosReembolso, CategoriaReembolso, CATEGORIAS_REEMBOLSO, STATUS_REEMBOLSO } from "@/types/reembolso"
import { useAppContext } from "@/app/context/AppContext"
import { X } from "lucide-react"

interface ModalVerReembolsoProps {
  aberto: boolean
  aoFechar: () => void
  reembolso: Reembolso | null
  aoSalvar: (dados: Reembolso) => void
}

export function ModalVerReembolso({ aberto, aoFechar, reembolso, aoSalvar }: ModalVerReembolsoProps) {
  const { addNotification } = useAppContext()
  const [emEdicao, setEmEdicao] = useState(false)
  const [dados, setDados] = useState<DadosReembolso>({
    nomeFuncionario: "",
    categoria: "Alimentação",
    descricao: "",
    valorReembolso: 0,
    dataReembolso: new Date().toISOString(),
    status: "Pendente",
  })

  useEffect(() => {
    if (reembolso && aberto) {
      setDados({
        nomeFuncionario: reembolso.nomeFuncionario,
        categoria: reembolso.categoria,
        descricao: reembolso.descricao,
        valorReembolso: reembolso.valorReembolso,
        dataReembolso: reembolso.dataReembolso,
        status: reembolso.status,
      })
      setEmEdicao(false)
    }
  }, [reembolso, aberto])

  const obterDataHoraFormatada = () => {
    const agora = new Date()
    const dia = String(agora.getDate()).padStart(2, "0")
    const mes = String(agora.getMonth() + 1).padStart(2, "0")
    const ano = agora.getFullYear()
    const horas = String(agora.getHours()).padStart(2, "0")
    const minutos = String(agora.getMinutes()).padStart(2, "0")
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`
  }

  const formatarData = (data: string | Date) => {
    const dataObj = typeof data === 'string' ? new Date(data) : data
    const dia = String(dataObj.getDate()).padStart(2, "0")
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0")
    const ano = dataObj.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`
  }

  const getBadgeVariant = (status: string) => {
    const variants: Record<string, string> = {
      "Rascunho": "bg-gray-500/15 text-gray-400 border-gray-500/30",
      "Pendente": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      "Aprovado": "bg-green-500/15 text-green-400 border-green-500/30",
      "Rejeitado": "bg-red-500/15 text-red-400 border-red-500/30",
    }
    return variants[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  }

  const handleSalvar = () => {
    // Validação
    if (!dados.nomeFuncionario.trim()) {
      addNotification({
        type: "error",
        message: "Nome do funcionário é obrigatório"
      })
      return
    }

    if (dados.valorReembolso <= 0) {
      addNotification({
        type: "error",
        message: "Valor do reembolso deve ser maior que zero"
      })
      return
    }

    if (!dados.descricao.trim()) {
      addNotification({
        type: "error",
        message: "Descrição é obrigatória"
      })
      return
    }

    const reembolsoAtualizado: Reembolso = {
      ...reembolso!,
      ...dados,
      ultimaAtualizacao: new Date().toISOString(),
    }

    aoSalvar(reembolsoAtualizado)
    setEmEdicao(false)
    aoFechar()
  }

  const handleEntrarEdicao = () => {
    setEmEdicao(true)
  }

  if (!reembolso) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="border-gray-800 bg-gray-950 max-w-sm max-h-85vh overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {emEdicao ? "Editar Reembolso" : "Detalhes do Reembolso"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {emEdicao ? (
            <>
              {/* Modo Edição */}
              <div className="space-y-2">
                <Label htmlFor="nomeFuncionario" className="text-gray-300 text-xs">
                  Nome do Funcionário *
                </Label>
                <Input
                  id="nomeFuncionario"
                  placeholder="Digite o nome..."
                  value={dados.nomeFuncionario}
                  onChange={(e) => setDados({ ...dados, nomeFuncionario: e.target.value })}
                  className="border-gray-800 bg-gray-900 text-white placeholder:text-gray-600 h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-gray-300 text-xs">
                  Categoria *
                </Label>
                <Select value={dados.categoria} onValueChange={(v) => setDados({ ...dados, categoria: v as CategoriaReembolso })}>
                  <SelectTrigger className="border-gray-800 bg-gray-900 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-gray-900">
                    {CATEGORIAS_REEMBOLSO.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-gray-300">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorReembolso" className="text-gray-300 text-xs">
                  Valor do Reembolso *
                </Label>
                <Input
                  id="valorReembolso"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={dados.valorReembolso}
                  onChange={(e) => setDados({ ...dados, valorReembolso: parseFloat(e.target.value) || 0 })}
                  className="border-gray-800 bg-gray-900 text-white placeholder:text-gray-600 h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataReembolso" className="text-gray-300 text-xs">
                  Data do Reembolso
                </Label>
                <Input
                  value={obterDataHoraFormatada()}
                  readOnly
                  className="border-gray-800 bg-gray-900 text-gray-400 cursor-not-allowed h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300 text-xs">
                  Status
                </Label>
                <Select value={dados.status} onValueChange={(v) => setDados({ ...dados, status: v as any })}>
                  <SelectTrigger className="border-gray-800 bg-gray-900 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-gray-900">
                    {STATUS_REEMBOLSO.map((status) => (
                      <SelectItem key={status} value={status} className="text-gray-300">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-gray-300 text-xs">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Digite a descrição..."
                  value={dados.descricao}
                  onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                  className="border-gray-800 bg-gray-900 text-white placeholder:text-gray-600 resize-none h-24 text-xs"
                />
              </div>
            </>
          ) : (
            <>
              {/* Modo Visualização */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">ID</p>
                  <p className="text-sm font-mono text-gray-300">{reembolso.idReembolso}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <span className={`inline-block rounded px-2 py-1 text-xs font-medium border ${getBadgeVariant(reembolso.status)}`}>
                    {reembolso.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Nome do Funcionário</p>
                <p className="text-sm text-gray-300">{reembolso.nomeFuncionario}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Categoria</p>
                <p className="text-sm text-gray-300">{reembolso.categoria}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Valor</p>
                  <p className="text-sm font-semibold text-white">{formatarValor(reembolso.valorReembolso)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Data</p>
                  <p className="text-sm text-gray-300">{formatarData(reembolso.dataReembolso)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Descrição</p>
                <p className="text-sm text-gray-300">{reembolso.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-800">
                <div>Criado em: {formatarData(reembolso.dataCriacao)}</div>
                <div className="text-right">Atualizado em: {formatarData(reembolso.ultimaAtualizacao)}</div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="border-gray-800 text-gray-300 hover:bg-gray-900"
            onClick={aoFechar}
          >
            Fechar
          </Button>
          {emEdicao ? (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSalvar}
            >
              Salvar Alterações
            </Button>
          ) : (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleEntrarEdicao}
            >
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
