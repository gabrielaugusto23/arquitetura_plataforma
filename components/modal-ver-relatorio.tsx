"use client"

import { useState, useEffect } from "react"
import { Edit2, X, Upload } from "lucide-react"
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
  CATEGORIAS_RELATORIO,
  PERIODOS_RELATORIO,
  STATUS_RELATORIO,
  TIPOS_POR_CATEGORIA,
  type CategoriaRelatorio,
  type Relatorio,
  type DadosRelatorio,
} from "@/types/relatorio"

interface ModalVerRelatorioProps {
  aberto: boolean
  aoFechar: () => void
  relatorio: Relatorio | null
  aoSalvarEdicao: (relatorioId: string, dados: DadosRelatorio) => Promise<void>
}

export function ModalVerRelatorio({
  aberto,
  aoFechar,
  relatorio,
  aoSalvarEdicao,
}: ModalVerRelatorioProps) {
  const { toast } = useToast()
  const [emEdicao, setEmEdicao] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)

  // Estado do formulário de edição
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

  // Inicializa os dados quando o modal abre com um relatório
  useEffect(() => {
    if (aberto && relatorio) {
      setDados({
        nome: relatorio.nome,
        categoria: relatorio.categoria,
        tipo: relatorio.tipo,
        periodo: relatorio.periodo,
        ultimaAtualizacao: relatorio.ultimaAtualizacao.toString(),
        status: relatorio.status,
        descricao: relatorio.descricao || "",
        arquivo: undefined,
      })
      setEmEdicao(false)
      setArquivo(null)
    }
  }, [aberto, relatorio])

  // Tipos disponíveis baseado na categoria selecionada
  const tiposDisponiveis = TIPOS_POR_CATEGORIA[dados.categoria as CategoriaRelatorio] || []

  const handleMudarCategoria = (novaCategoria: string) => {
    setDados({
      ...dados,
      categoria: novaCategoria as CategoriaRelatorio,
      tipo: "", // Reseta tipo ao mudar categoria
    })
  }

  const handleMudarDataHora = (novaData: string) => {
    if (!novaData) return
    
    const [data, hora] = novaData.split('T')
    if (!data || !hora) return
    
    const [ano, mes, dia] = data.split('-')
    const [horas, minutos] = hora.split(':')
    
    const dataLocal = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(horas),
      parseInt(minutos)
    )
    
    setDados({
      ...dados,
      ultimaAtualizacao: dataLocal.toISOString(),
    })
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

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!relatorio) return

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

    setCarregando(true)

    try {
      // Chamada ao backend para editar relatório
      // Conexão com API: PUT /api/relatorios/:id
      // Body: FormData com os dados atualizados e arquivo CSV (opcional)
      // IMPORTANTE: Implementar no backend:
      // - Validar arquivo CSV (se fornecido)
      // - Atualizar registro no banco de dados
      // - Processar novo arquivo se fornecido
      // - Retornar dados do relatório atualizado

      await aoSalvarEdicao(relatorio.id, dados)

      toast({
        title: "Relatório atualizado",
        description: "Suas alterações foram salvas com sucesso",
      })

      setEmEdicao(false)
      setArquivo(null)
    } catch (erro) {
      toast({
        title: "Erro ao atualizar relatório",
        description: "Ocorreu um erro ao atualizar o relatório. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao atualizar relatório:", erro)
    } finally {
      setCarregando(false)
    }
  }

  // Formata status para a cor da badge
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Processando":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      case "Erro":
        return "bg-red-500/15 text-red-400 border-red-500/20"
      case "Arquivado":
        return "bg-gray-500/15 text-gray-400 border-gray-500/20"
      default:
        return ""
    }
  }

  if (!relatorio) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-white">
              {emEdicao ? "Editar Relatório" : "Detalhes do Relatório"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {emEdicao
                ? "Altere as informações do relatório"
                : "Visualize e gerencie este relatório"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {emEdicao ? (
          // Modo de edição
          <form onSubmit={handleSalvarEdicao} className="space-y-4">
            {/* Nome do relatório */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-300">
                Nome do Relatório
              </Label>
              <Input
                id="nome"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-600"
                required
              />
            </div>

            {/* Categoria */}
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

            {/* Tipo */}
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

            {/* Data e Hora */}
            <div className="space-y-2">
              <Label htmlFor="ultimaAtualizacao" className="text-gray-300">
                Data e Hora
              </Label>
              <Input
                id="ultimaAtualizacao"
                type="datetime-local"
                value={new Date(dados.ultimaAtualizacao).toISOString().slice(0, 16)}
                onChange={(e) => handleMudarDataHora(e.target.value)}
                className="border-gray-800 bg-gray-950 text-white"
                required
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
                Descrição
              </Label>
              <Textarea
                id="descricao"
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
                  />
                  <Upload className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                  <p className="text-xs text-gray-300">
                    Clique para selecionar um novo arquivo CSV
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
                onClick={() => setEmEdicao(false)}
                className="border-gray-800 text-gray-300 hover:bg-gray-950"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Modo de visualização
          <div className="space-y-4">
            {/* Informações do relatório */}
            <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-950 p-3">
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium text-white">{relatorio.nome}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Categoria</p>
                  <p className="text-sm text-gray-300">{relatorio.categoria}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-sm text-gray-300">{relatorio.tipo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Período</p>
                  <p className="text-sm text-gray-300">{relatorio.periodo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getBadgeVariant(relatorio.status)}>
                    {relatorio.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Última Atualização</p>
                <p className="text-sm text-gray-300">
                  {new Date(relatorio.ultimaAtualizacao).toLocaleString("pt-BR")}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tamanho</p>
                <p className="text-sm text-gray-300">{relatorio.tamanho}</p>
              </div>

              {relatorio.descricao && (
                <div>
                  <p className="text-xs text-gray-500">Descrição</p>
                  <p className="text-sm text-gray-300">{relatorio.descricao}</p>
                </div>
              )}

              {relatorio.usuarioCriacao && (
                <div>
                  <p className="text-xs text-gray-500">Criado por</p>
                  <p className="text-sm text-gray-300">{relatorio.usuarioCriacao}</p>
                </div>
              )}

              {relatorio.usuarioEdicao && (
                <div>
                  <p className="text-xs text-gray-500">Última edição por</p>
                  <p className="text-sm text-gray-300">{relatorio.usuarioEdicao}</p>
                </div>
              )}
            </div>

            {/* Rodapé com ações */}
            <DialogFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={aoFechar}
                className="border-gray-800 text-gray-300 hover:bg-gray-950"
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => setEmEdicao(true)}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
