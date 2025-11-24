"use client"

// Componentes para a interface de relatórios
import { useState, useMemo } from "react"
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

// Ícones relacionados a dados, arquivos e análises
import { ArrowUp, BarChart3, FileText, Download, Calendar, Eye, Edit2 } from 'lucide-react'
import { type Relatorio, type FiltrosRelatorio, type DadosRelatorio } from "@/types/relatorio"

// Dados mockados de relatórios para demonstração
// IMPORTATE: Quando conectar ao backend, substituir por chamda  API
const RELATORIOS_MOCKADOS: Relatorio[] = [
  {
    id: "R001",
    nome: "Vendas Mensais",
    categoria: "Vendas",
    tipo: "Vendas Mensais",
    periodo: "Mensal",
    ultimaAtualizacao: new Date("2025-06-10T09:30:00").toISOString(),
    tamanho: "2.3 MB",
    status: "Disponível",
    descricao: "Análise detalhada de vendas do mês",
    usuarioCriacao: "João Silva",
    caminhoArquivo: "/arquivos/vendas_mensais.csv",
  },
  {
    id: "R002",
    nome: "Estoque Detalhado",
    categoria: "Estoque",
    tipo: "Estoque Detalhado",
    periodo: "Semanal",
    ultimaAtualizacao: new Date("2025-06-09T18:45:00").toISOString(),
    tamanho: "1.8 MB",
    status: "Disponível",
    descricao: "Situação atual do estoque",
    usuarioCriacao: "Maria Santos",
    caminhoArquivo: "/arquivos/estoque_detalhado.csv",
  },
  {
    id: "R003",
    nome: "Clientes Ativos",
    categoria: "Clientes",
    tipo: "Clientes Ativos",
    periodo: "Mensal",
    ultimaAtualizacao: new Date("2025-06-10T14:20:00").toISOString(),
    tamanho: "945 KB",
    status: "Disponível",
    descricao: "Lista de clientes ativos no período",
    usuarioCriacao: "Pedro Costa",
    caminhoArquivo: "/arquivos/clientes_ativos.csv",
  },
  {
    id: "R004",
    nome: "Reembolsos Pendentes",
    categoria: "Financeiro",
    tipo: "Reembolsos por Funcionário",
    periodo: "Diário",
    ultimaAtualizacao: new Date("2025-06-10T16:15:00").toISOString(),
    tamanho: "567 KB",
    status: "Processando",
    descricao: "Reembolsos aguardando processamento",
    usuarioCriacao: "Ana Oliveira",
    caminhoArquivo: "/arquivos/reembolsos_pendentes.csv",
  },
  {
    id: "R005",
    nome: "Performance de Vendas",
    categoria: "Análise",
    tipo: "Análise Comparativa",
    periodo: "Trimestral",
    ultimaAtualizacao: new Date("2025-06-08").toISOString(),
    tamanho: "4.1 MB",
    status: "Disponível",
    descricao: "Análise de performance trimestral",
    usuarioCriacao: "Carlos Mendes",
    caminhoArquivo: "/arquivos/performance_vendas.csv",
  },
  {
    id: "R006",
    nome: "Produtos Mais Vendidos",
    categoria: "Estoque",
    tipo: "Produtos Mais Vendidos",
    periodo: "Mensal",
    ultimaAtualizacao: new Date("2025-06-10T11:00:00").toISOString(),
    tamanho: "1.2 MB",
    status: "Disponível",
    descricao: "Produtos com maior volume de vendas",
    usuarioCriacao: "Lucia Ferreira",
    caminhoArquivo: "/arquivos/produtos_vendidos.csv",
  },
  {
    id: "R007",
    nome: "Fluxo de Caixa",
    categoria: "Financeiro",
    tipo: "Fluxo de Caixa",
    periodo: "Mensal",
    ultimaAtualizacao: new Date("2025-06-10T15:30:00").toISOString(),
    tamanho: "-",
    status: "Processando",
    descricao: "Fluxo de caixa do período",
    usuarioCriacao: "Roberto Silva",
    caminhoArquivo: undefined,
  },
]

export default function RelatoriosPage() {
  const { toast } = useToast()
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null)
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({})
  const [relatorios, setRelatorios] = useState<Relatorio[]>(RELATORIOS_MOCKADOS)

  // Filtra os relatórios baseado nos filtros aplicados
  const relatoriosFiltrados = useMemo(() => {
    return relatorios.filter((relatorio) => {
      // Filtro por categoria
      if (filtros.categoria && relatorio.categoria !== filtros.categoria) {
        return false
      }

      // Filtro por tipo
      if (filtros.tipo && relatorio.tipo !== filtros.tipo) {
        return false
      }

      // Filtro por período
      if (filtros.periodo && relatorio.periodo !== filtros.periodo) {
        return false
      }

      // Filtro por status
      if (filtros.status && relatorio.status !== filtros.status) {
        return false
      }

      // Filtro por (nome)
      if (filtros.busca && filtros.busca.trim()) {
        const buscaMinuscula = filtros.busca.toLowerCase()
        if (!relatorio.nome.toLowerCase().includes(buscaMinuscula)) {
          return false
        }
      }

      return true
    })
  }, [relatorios, filtros])

  // Abre modal para ver relatório
  const handleAbrirVerRelatorio = (relatorio: Relatorio) => {
    setRelatorioSelecionado(relatorio)
    setModalVerAberto(true)
  }

  // Cria novo relatório
  const handleCriarRelatorio = async (dados: DadosRelatorio) => {
    // IMPORTANTE: Implementar chamada ao backend
    // Endpoint: POST /api/relatorios
    // Body: FormData com dados do relatório
    
    const novoRelatorio: Relatorio = {
      id: `R${Math.random().toString(36).substr(2, 9)}`,
      nome: dados.nome,
      categoria: dados.categoria,
      tipo: dados.tipo,
      periodo: dados.periodo,
      ultimaAtualizacao: new Date().toISOString(),
      tamanho: dados.arquivo ? `${(dados.arquivo.size / 1024 / 1024).toFixed(2)} MB` : "0 MB",
      status: dados.status,
      descricao: dados.descricao,
      usuarioCriacao: "Usuário Logado", // Substituir pelo usuário real
      caminhoArquivo: `/arquivos/${dados.arquivo?.name}`,
    }

    setRelatorios([novoRelatorio, ...relatorios])
    toast({
      title: "Sucesso",
      description: "Relatório criado com sucesso",
    })
  }

  // Edita relatório existente
  const handleEditarRelatorio = async (relatorioId: string, dados: DadosRelatorio) => {
    // IMPORTANTE: Implementar chamada ao backend

    setRelatorios(
      relatorios.map((rel) =>
        rel.id === relatorioId
          ? {
              ...rel,
              nome: dados.nome,
              categoria: dados.categoria,
              tipo: dados.tipo,
              periodo: dados.periodo,
              ultimaAtualizacao: new Date().toISOString(),
              status: dados.status,
              descricao: dados.descricao,
              usuarioEdicao: "Usuário Logado",
              dataEdicao: new Date().toISOString(),
              tamanho: dados.arquivo
                ? `${(dados.arquivo.size / 1024 / 1024).toFixed(2)} MB`
                : rel.tamanho,
            }
          : rel
      )
    )

    toast({
      title: "Sucesso",
      description: "Relatório atualizado com sucesso",
    })
  }

  // Baixa relatório em Excel
  const handleBaixarRelatorio = (relatorio: Relatorio) => {
    // IMPORTANTE: Implementar chamada ao backend
    // Endpoint: GET /api/relatorios/:id/download

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
              <CardTitle className="text-sm font-medium text-gray-300">Relatórios Hoje</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{relatorios.length}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +{relatorios.length} total
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
              {relatorios.filter((r) => r.status === "Disponível").length}
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
              {relatorios.filter((r) => r.status === "Processando").length}
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
              {relatoriosFiltrados.length} relatório(s) encontrado(s)
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
                {/* Lista dinâmica de relatórios filtrados */}
                {relatoriosFiltrados.length > 0 ? (
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
                      <TableCell className="text-white">{relatorio.tamanho}</TableCell>
                      <TableCell>
                        {/* seçãostatus do relatório */}
                        <Badge className={getBadgeVariant(relatorio.status)}>
                          {relatorio.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Botões de ação dependendo do status do relatório */}
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
