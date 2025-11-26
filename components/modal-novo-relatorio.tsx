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
  CATEGORIAS_RELATORIO,
  PERIODOS_RELATORIO,
  STATUS_RELATORIO,
  TIPOS_POR_CATEGORIA,
  type CategoriaRelatorio,
  type DadosRelatorio,
} from "@/types/relatorio"

interface ModalNovoRelatorioProps {
  aberto: boolean
  aoFechar: () => void
  aoEnviar: (dados: DadosRelatorio) => Promise<void>
}

export function ModalNovoRelatorio({ aberto, aoFechar, aoEnviar }: ModalNovoRelatorioProps) {
  const { toast } = useToast()
  const [carregando, setCarregando] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)

  // Estado do formulário
  const [dados, setDados] = useState<DadosRelatorio>({
    nome: "",
    categoria: "Vendas",
    tipo: "",
    periodo: "Mensal",
    ultimaAtualizacao: new Date().toISOString(),
    status: "Disponível",
    descricao: "",
    arquivo: undefined,
  })

  // Atualizar data e hora automaticamente quando o modal abre
  const atualizarDataHora = () => {
    setDados(prev => ({
      ...prev,
      ultimaAtualizacao: new Date().toISOString()
    }))
  }

  // Tipos disponíveis baseado na categoria selecionada
  const tiposDisponiveis = TIPOS_POR_CATEGORIA[dados.categoria as CategoriaRelatorio] || []

  const handleMudarCategoria = (novaCategoria: string) => {
    setDados({
      ...dados,
      categoria: novaCategoria as CategoriaRelatorio,
      tipo: "", // Reseta tipo ao mudar categoria
    })
  }

  const obterDataHoraFormatada = () => {
    const agora = new Date()
    const dia = String(agora.getDate()).padStart(2, '0')
    const mes = String(agora.getMonth() + 1).padStart(2, '0')
    const ano = agora.getFullYear()
    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`
  }

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (arquivo) {
      // Valida se é um arquivo CSV
      if (!arquivo.name.endsWith(".csv")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato CSV",
          variant: "destructive",
        })
        return
      }

      // Valida tamanho do arquivo (máximo 5MB)
      if (arquivo.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        })
        return
      }

      setArquivo(arquivo)
      setDados({
        ...dados,
        arquivo: arquivo,
      })
    }
  }

  const handleRemoverArquivo = () => {
    setArquivo(null)
    setDados({
      ...dados,
      arquivo: undefined,
    })
  }

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!dados.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome do relatório",
        variant: "destructive",
      })
      return
    }

    if (!dados.tipo) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione o tipo de relatório",
        variant: "destructive",
      })
      return
    }

    // REMOVIDO: Bloco de validação de arquivo obrigatório
    // if (!arquivo) { ... }

    setCarregando(true)

    try {
      await aoEnviar(dados)

      toast({
        title: "Relatório criado",
        description: "Seu relatório foi criado com sucesso",
      })

      // Limpa o formulário
      setDados({
        nome: "",
        categoria: "Vendas",
        tipo: "",
        periodo: "Mensal",
        ultimaAtualizacao: new Date().toISOString(),
        status: "Disponível",
        descricao: "",
        arquivo: undefined,
      })
      setArquivo(null)
      aoFechar()
    } catch (erro) {
      toast({
        title: "Erro ao criar relatório",
        description: "Ocorreu um erro ao criar o relatório. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao criar relatório:", erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg" onOpenAutoFocus={() => atualizarDataHora()}>
        <DialogHeader>
          <DialogTitle className="text-white">Novo Relatório</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informações para criar um novo relatório
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnviar} className="space-y-4">
          {/* Nome do relatório */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-gray-300">
              Nome do Relatório
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Vendas Março 2025"
              value={dados.nome}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-600"
              required
            />
          </div>

          {/* Categoria (dropdown) */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-gray-300">
              Categoria
            </Label>
            <Select value={dados.categoria} onValueChange={handleMudarCategoria}>
              <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-gray-200">
                {CATEGORIAS_RELATORIO.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo (dropdown - dinâmico baseado na categoria) */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-gray-300">
              Tipo
            </Label>
            <Select value={dados.tipo} onValueChange={(tipo) => setDados({ ...dados, tipo })}>
              <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-gray-200">
                {tiposDisponiveis.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <Label htmlFor="periodo" className="text-gray-300">
              Período
            </Label>
            <Select value={dados.periodo} onValueChange={(periodo) => setDados({ ...dados, periodo: periodo as any })}>
              <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                <SelectValue placeholder="Selecione um período" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-gray-200">
                {PERIODOS_RELATORIO.map((periodo) => (
                  <SelectItem key={periodo} value={periodo}>
                    {periodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora da última atualização */}
          <div className="space-y-1">
            <Label htmlFor="ultimaAtualizacao" className="text-xs text-gray-400">
              Data e Hora
            </Label>
            <Input
              id="ultimaAtualizacao"
              type="text"
              value={obterDataHoraFormatada()}
              readOnly
              className="h-8 border-gray-800 bg-gray-950 text-xs text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300">
              Status
            </Label>
            <Select value={dados.status} onValueChange={(status) => setDados({ ...dados, status: status as any })}>
              <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-black text-gray-200">
                {STATUS_RELATORIO.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-gray-300">
              Descrição (opcional)
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o conteúdo do relatório..."
              value={dados.descricao}
              onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              className="min-h-[80px] border-gray-800 bg-gray-950 text-white placeholder:text-gray-600"
            />
          </div>

          {/* Upload de arquivo CSV */}
          <div className="space-y-2">
            <Label htmlFor="arquivo" className="text-gray-300">
              Arquivo CSV (opcional)
            </Label>
            {!arquivo ? (
              <label className="relative block cursor-pointer rounded-lg border border-dashed border-gray-800 bg-gray-950 p-4 text-center transition hover:border-orange-500/50">
                <input
                  id="arquivo"
                  type="file"
                  accept=".csv"
                  onChange={handleSelecionarArquivo}
                  className="hidden"
                  // REMOVIDO: required
                />
                <Upload className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                <p className="text-xs text-gray-300">
                  Clique para selecionar ou arraste um arquivo CSV
                </p>
                <p className="mt-1 text-xs text-gray-600">Máximo 5MB</p>
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3">
                <span className="text-sm text-gray-300">{arquivo.name}</span>
                <button
                  type="button"
                  onClick={handleRemoverArquivo}
                  className="text-gray-500 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Rodapé com ações */}
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={aoFechar}
              className="border-gray-800 text-gray-300 hover:bg-gray-950"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600"
              disabled={carregando}
            >
              {carregando ? "Criando..." : "Criar Relatório"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}