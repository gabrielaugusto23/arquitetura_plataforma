"use client"

// Componentes para a interface de relatórios
import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ModalNovoRelatorio } from "@/components/modal-novo-relatorio"
import { ModalVerRelatorio } from "@/components/modal-ver-relatorio"
import { ComponenteFiltroRelatorios } from "@/components/componente-filtro-relatorios"
import { useToast } from "@/hooks/use-toast"
import { exportarRelatoriosEmCSV } from "@/lib/utilitario-exportacao"
import { ServicoRelatorios } from "@/lib/servico-relatorios" // <--- Importação do Serviço

// Ícones relacionados a dados, arquivos e análises
import { ArrowUp, BarChart3, FileText, Download, Calendar, Eye, Edit2, Loader2 } from 'lucide-react'
import { type Relatorio, type FiltrosRelatorio, type DadosRelatorio } from "@/types/relatorio"

export default function RelatoriosPage() {
  const { toast } = useToast()
  
  // Estados de controle
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null)
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({})
  
  // Estado dos dados (Inicia vazio)
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [carregando, setCarregando] = useState(true)

  // 1. Efeito para carregar os dados do Backend ao abrir a página
  useEffect(() => {
    carregarRelatorios()
  }, [])

  const carregarRelatorios = async () => {
    try {
      setCarregando(true)
      const dados = await ServicoRelatorios.listarRelatorios()
      setRelatorios(dados)
    } catch (erro) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível buscar os relatórios do sistema.",
        variant: "destructive"
      })
    } finally {
      setCarregando(false)
    }
  }

  // Filtra os relatórios baseado nos filtros aplicados (Mantido igual)
  const relatoriosFiltrados = useMemo(() => {
    return relatorios.filter((relatorio) => {
      if (filtros.categoria && relatorio.categoria !== filtros.categoria) return false
      if (filtros.tipo && relatorio.tipo !== filtros.tipo) return false
      if (filtros.periodo && relatorio.periodo !== filtros.periodo) return false
      if (filtros.status && relatorio.status !== filtros.status) return false
      if (filtros.busca && filtros.busca.trim()) {
        const buscaMinuscula = filtros.busca.toLowerCase()
        if (!relatorio.nome.toLowerCase().includes(buscaMinuscula)) return false
      }
      return true
    })
  }, [relatorios, filtros])

  // Abre modal para ver relatório
  const handleAbrirVerRelatorio = (relatorio: Relatorio) => {
    setRelatorioSelecionado(relatorio)
    setModalVerAberto(true)
  }

  // 2. Conexão com Backend: Criar Novo Relatório
  const handleCriarRelatorio = async (dados: DadosRelatorio) => {
    try {
      // Chama o serviço
      const novoRelatorio = await ServicoRelatorios.criarRelatorio(dados)
      
      // Atualiza a lista com o retorno real do backend
      setRelatorios([novoRelatorio, ...relatorios])
      
      setModalNovoAberto(false) // Fecha o modal
      toast({
        title: "Sucesso",
        description: "Relatório criado com sucesso",
      })
    } catch (erro) {
      console.error(erro)
      toast({
        title: "Erro",
        description: "Falha ao criar o relatório. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  // 3. Conexão com Backend: Editar Relatório
  const handleEditarRelatorio = async (relatorioId: string, dados: DadosRelatorio) => {
    try {
      // Chama o serviço
      const relatorioAtualizado = await ServicoRelatorios.editarRelatorio(relatorioId, dados)

      // Atualiza o item específico na lista
      setRelatorios(
        relatorios.map((rel) =>
          rel.id === relatorioId ? relatorioAtualizado : rel
        )
      )

      // Atualiza também o selecionado se o modal de visualização estiver aberto
      if (relatorioSelecionado?.id === relatorioId) {
        setRelatorioSelecionado(relatorioAtualizado)
      }

      toast({
        title: "Sucesso",
        description: "Relatório atualizado com sucesso",
      })
    } catch (erro) {
      console.error(erro)
      toast({
        title: "Erro",
        description: "Falha ao atualizar o relatório.",
        variant: "destructive"
      })
    }
  }

  // Baixa relatório (Mantendo lógica frontend por enquanto, mas pode ser ajustada para URL real)
  const handleBaixarRelatorio = (relatorio: Relatorio) => {
    // Se o backend retornar um caminhoArquivo real (URL pública), você poderia usar window.open(relatorio.caminhoArquivo)
    // Por enquanto, mantemos a exportação CSV dos metadados como fallback
    exportarRelatoriosEmCSV([relatorio], `${relatorio.nome}.csv`)

    toast({
      title: "Download iniciado",
      description: `${relatorio.nome} está sendo baixado`,
    })
  }

  // Baixa todos os relatórios filtrados
  const handleBaixarTodos = () => {
    if (relatoriosFiltrados.length === 0) {
      toast({
        title: "Nenhum relatório",
        description: "Não há relatórios para baixar",
        variant: "destructive",
      })
      return
    }

    exportarRelatoriosEmCSV(relatoriosFiltrados, "relatorios-exportacao.csv")

    toast({
      title: "Download iniciado",
      description: `${relatoriosFiltrados.length} relatório(s) estão sendo baixado(s)`,
    })
  }

  // Formata status com badge apropriada
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cabeçalho da seção de relatórios e análises */}
        <PageHeader
          title="Relatórios"
          description="Analise dados e gere relatórios do sistema"
          actions={
            <div className="flex gap-2">
              <Button
                onClick={handleBaixarTodos}
                variant="outline"
                className="border-gray-800 text-gray-300 hover:bg-gray-950"
                disabled={carregando || relatorios.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button
                onClick={() => setModalNovoAberto(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Novo Relatório
              </Button>
            </div>
          }
          breadcrumbs={[{ label: "Início", href: "/" }, { label: "Relatórios" }]}
        />

        {/* Métricas sobre a atividade de relatórios - uso e estatísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total Relatórios</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {carregando ? "-" : relatorios.length}
            </div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Atualizado agora
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Disponíveis</CardTitle>
              <Download className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {carregando ? "-" : relatorios.filter((r) => r.status === "Disponível").length}
            </div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Prontos para download
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Processando</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {carregando ? "-" : relatorios.filter((r) => r.status === "Processando").length}
            </div>
            <p className="mt-1 flex items-center text-xs text-yellow-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Em processamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Filtrados</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{relatoriosFiltrados.length}</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Com filtros aplicados
            </p>
          </CardContent>
        </Card>
        </div>

        {/* Sistema de filtros de relatórios */}
        <ComponenteFiltroRelatorios
          aoFiltrar={setFiltros}
          aoLimpar={() => setFiltros({})}
        />

        {/* aqui ficam todos os documentos gerados */}
        <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Relatórios Disponíveis</CardTitle>
            <span className="text-sm text-gray-400">
              {carregando ? "Carregando..." : `${relatoriosFiltrados.length} relatório(s) encontrado(s)`}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabela com informações detalhadas de cada um */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Nome do Relatório</TableHead>
                  <TableHead className="text-gray-300">Tipo</TableHead>
                  <TableHead className="text-gray-300">Período</TableHead>
                  <TableHead className="text-gray-300">Última Atualização</TableHead>
                  <TableHead className="text-gray-300">Tamanho</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                   <TableRow className="border-gray-800">
                     <TableCell colSpan={7} className="py-8 text-center text-gray-400">
                       <div className="flex justify-center items-center gap-2">
                         <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                         Carregando relatórios...
                       </div>
                     </TableCell>
                   </TableRow>
                ) : relatoriosFiltrados.length > 0 ? (
                  relatoriosFiltrados.map((relatorio, indice) => (
                    <TableRow
                      key={relatorio.id}
                      className={`border-gray-800 hover:bg-gray-900 ${
                        indice % 2 === 0 ? "bg-black" : "bg-gray-950/60"
                      }`}
                    >
                      <TableCell className="text-white font-medium">{relatorio.nome}</TableCell>
                      <TableCell className="text-gray-300">{relatorio.tipo}</TableCell>
                      <TableCell className="text-gray-300">{relatorio.periodo}</TableCell>
                      <TableCell className="text-gray-300">
                        {typeof relatorio.ultimaAtualizacao === 'string'
                          ? new Date(relatorio.ultimaAtualizacao).toLocaleString("pt-BR")
                          : relatorio.ultimaAtualizacao.toLocaleString("pt-BR")
                        }
                      </TableCell>
                      <TableCell className="text-white">{relatorio.tamanho || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeVariant(relatorio.status)}>
                          {relatorio.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {relatorio.status === "Disponível" && (
                            <Button
                              size="sm"
                              onClick={() => handleBaixarRelatorio(relatorio)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleAbrirVerRelatorio(relatorio)}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={7} className="py-8 text-center text-gray-400">
                      Nenhum relatório encontrado com os filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Modal para criar novo relatório */}
      <ModalNovoRelatorio
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoEnviar={handleCriarRelatorio}
      />

      {/* Modal para ver e editar relatório */}
      <ModalVerRelatorio
        aberto={modalVerAberto}
        aoFechar={() => setModalVerAberto(false)}
        relatorio={relatorioSelecionado}
        aoSalvarEdicao={handleEditarRelatorio}
      />
    </DashboardLayout>
  )
}