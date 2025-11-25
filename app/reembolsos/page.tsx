"use client"

import Link from "next/link"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Trash2, Check, X } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { useAppContext } from "@/app/context/AppContext"
import { Reembolso, FiltrosReembolso, STATUS_REEMBOLSO } from "@/types/reembolso"
import { ModalVerReembolso } from "@/components/modal-ver-reembolso"
import { ModalFiltroReembolsos } from "@/components/modal-filtro-reembolsos"

// Mock data
const reembolsosMock: Reembolso[] = [
  {
    id: "1",
    idReembolso: "R001",
    nomeFuncionario: "João Silva",
    categoria: "Combustível",
    descricao: "Viagem cliente ABC",
    valorReembolso: 120.00,
    dataReembolso: new Date(2025, 5, 10).toISOString(),
    status: "Pendente",
    dataCriacao: new Date(2025, 5, 10).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 10).toISOString(),
  },
  {
    id: "2",
    idReembolso: "R002",
    nomeFuncionario: "Maria Santos",
    categoria: "Alimentação",
    descricao: "Almoço com cliente XYZ",
    valorReembolso: 85.50,
    dataReembolso: new Date(2025, 5, 9).toISOString(),
    status: "Aprovado",
    dataCriacao: new Date(2025, 5, 9).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 9).toISOString(),
  },
  {
    id: "3",
    idReembolso: "R003",
    nomeFuncionario: "Pedro Costa",
    categoria: "Material",
    descricao: "Materiais de escritório",
    valorReembolso: 245.30,
    dataReembolso: new Date(2025, 5, 8).toISOString(),
    status: "Pendente",
    dataCriacao: new Date(2025, 5, 8).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 8).toISOString(),
  },
  {
    id: "4",
    idReembolso: "R004",
    nomeFuncionario: "Ana Oliveira",
    categoria: "Transporte",
    descricao: "Uber para reunião",
    valorReembolso: 32.50,
    dataReembolso: new Date(2025, 5, 7).toISOString(),
    status: "Rejeitado",
    dataCriacao: new Date(2025, 5, 7).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 7).toISOString(),
  },
  {
    id: "5",
    idReembolso: "R005",
    nomeFuncionario: "Carlos Mendes",
    categoria: "Hospedagem",
    descricao: "Hotel viagem negócios",
    valorReembolso: 450.00,
    dataReembolso: new Date(2025, 5, 6).toISOString(),
    status: "Aprovado",
    dataCriacao: new Date(2025, 5, 6).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 6).toISOString(),
  },
  {
    id: "6",
    idReembolso: "R006",
    nomeFuncionario: "Lucas Ferreira",
    categoria: "Refeição",
    descricao: "Café de trabalho",
    valorReembolso: 25.00,
    dataReembolso: new Date(2025, 5, 5).toISOString(),
    status: "Rascunho",
    dataCriacao: new Date(2025, 5, 5).toISOString(),
    ultimaAtualizacao: new Date(2025, 5, 5).toISOString(),
  },
]

export default function ReembolsosPage() {
  const { addNotification } = useAppContext()
  const [busca, setBusca] = useState("")
  const [reembolsos, setReembolsos] = useState(reembolsosMock)
  const [statusFiltro, setStatusFiltro] = useState<string>("Todas")
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false)
  const [reembolsoSelecionado, setReembolsoSelecionado] = useState<Reembolso | null>(null)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosReembolso>({})

  const itensPorPagina = 10

  const reembolsosFiltrados = reembolsos.filter((r) => {
    const matchBusca = r.idReembolso.toLowerCase().includes(busca.toLowerCase()) ||
      r.nomeFuncionario.toLowerCase().includes(busca.toLowerCase()) ||
      r.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      r.descricao.toLowerCase().includes(busca.toLowerCase())
    
    const matchStatus = statusFiltro === "Todas" || r.status === statusFiltro
    
    const matchFiltros = (!filtrosAplicados.nomeFuncionario || 
      r.nomeFuncionario.toLowerCase().includes(filtrosAplicados.nomeFuncionario.toLowerCase())) &&
      (!filtrosAplicados.categoria || r.categoria === filtrosAplicados.categoria) &&
      (!filtrosAplicados.status || r.status === filtrosAplicados.status)
    
    return matchBusca && matchStatus && matchFiltros
  })

  const indexInicial = (paginaAtual - 1) * itensPorPagina
  const reembolsosPaginados = reembolsosFiltrados.slice(indexInicial, indexInicial + itensPorPagina)
  const totalPaginas = Math.ceil(reembolsosFiltrados.length / itensPorPagina)

  const handleVerReembolso = (reembolso: Reembolso) => {
    setReembolsoSelecionado(reembolso)
    setModalVerAberto(true)
  }

  const handleSalvarReembolso = (reembolsoAtualizado: Reembolso) => {
    setReembolsos(reembolsos.map((r) => (r.id === reembolsoAtualizado.id ? reembolsoAtualizado : r)))
    addNotification({
      type: "success",
      message: "Reembolso atualizado com sucesso!"
    })
  }

  const handleAprovar = (id: string) => {
    setReembolsos(reembolsos.map((r) =>
      r.id === id ? { ...r, status: "Aprovado" as const, ultimaAtualizacao: new Date().toISOString() } : r
    ))
    addNotification({
      type: "success",
      message: "Reembolso aprovado!"
    })
  }

  const handleRejeitar = (id: string) => {
    setReembolsos(reembolsos.map((r) =>
      r.id === id ? { ...r, status: "Rejeitado" as const, ultimaAtualizacao: new Date().toISOString() } : r
    ))
    addNotification({
      type: "error",
      message: "Reembolso rejeitado!"
    })
  }

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este reembolso?")) {
      setReembolsos(reembolsos.filter((r) => r.id !== id))
      addNotification({
        type: "success",
        message: "Reembolso excluído com sucesso!"
      })
    }
  }

  const handleAplicarFiltros = (filtros: FiltrosReembolso) => {
    setFiltrosAplicados(filtros)
    setPaginaAtual(1)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
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

  return (
    <DashboardLayout>
      <PageHeader
        title="Reembolsos"
        description="Gerencie solicitações de reembolso de despesas"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Reembolsos" }]}
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/reembolsos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Link>
          </Button>
        }
      />

      <Card className="border-gray-800 bg-black p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Buscar por ID, funcionário, categoria ou descrição..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setPaginaAtual(1)
              }}
              className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-600"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-gray-800 text-gray-300 hover:bg-gray-900 flex items-center gap-2"
            onClick={() => setModalFiltroAberto(true)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Tabs value={statusFiltro} onValueChange={(v) => {
          setStatusFiltro(v)
          setPaginaAtual(1)
        }} className="w-full">
          <TabsList className="border-b border-gray-800 bg-black grid w-full grid-cols-5">
            <TabsTrigger value="Todas" className="text-gray-400 data-[state=active]:text-orange-500">
              Todas
            </TabsTrigger>
            <TabsTrigger value="Rascunho" className="text-gray-400 data-[state=active]:text-orange-500">
              Rascunho
            </TabsTrigger>
            <TabsTrigger value="Pendente" className="text-gray-400 data-[state=active]:text-orange-500">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="Aprovado" className="text-gray-400 data-[state=active]:text-orange-500">
              Aprovadas
            </TabsTrigger>
            <TabsTrigger value="Rejeitado" className="text-gray-400 data-[state=active]:text-orange-500">
              Rejeitadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFiltro} className="mt-6">
            {reembolsosPaginados.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">Nenhum reembolso encontrado</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="text-gray-400">ID</TableHead>
                        <TableHead className="text-gray-400">Funcionário</TableHead>
                        <TableHead className="text-gray-400">Categoria</TableHead>
                        <TableHead className="text-gray-400">Descrição</TableHead>
                        <TableHead className="text-gray-400">Valor</TableHead>
                        <TableHead className="text-gray-400">Data</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reembolsosPaginados.map((reembolso) => (
                        <TableRow key={reembolso.id} className="border-gray-800 hover:bg-gray-950/50">
                          <TableCell className="font-mono text-sm text-gray-300">{reembolso.idReembolso}</TableCell>
                          <TableCell className="text-sm text-gray-300">{reembolso.nomeFuncionario}</TableCell>
                          <TableCell className="text-sm text-gray-300">{reembolso.categoria}</TableCell>
                          <TableCell className="text-sm text-gray-300">{reembolso.descricao}</TableCell>
                          <TableCell className="font-semibold text-white">{formatarValor(reembolso.valorReembolso)}</TableCell>
                          <TableCell className="text-sm text-gray-400">{formatarData(reembolso.dataReembolso)}</TableCell>
                          <TableCell>
                            <span className={`inline-block rounded px-2 py-1 text-xs font-medium border ${getBadgeVariant(reembolso.status)}`}>
                              {reembolso.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {reembolso.status === "Pendente" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="h-8 bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
                                    onClick={() => handleAprovar(reembolso.id)}
                                    title="Aprovar"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8 bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1"
                                    onClick={() => handleRejeitar(reembolso.id)}
                                    title="Rejeitar"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                onClick={() => handleVerReembolso(reembolso)}
                                title="Visualizar/Editar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                onClick={() => handleExcluir(reembolso.id)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPaginas > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                    <span className="text-sm text-gray-400">
                      Página {paginaAtual} de {totalPaginas} ({reembolsosFiltrados.length} resultados)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                        disabled={paginaAtual === 1}
                        className="border-gray-800 text-gray-300 hover:bg-gray-900"
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="border-gray-800 text-gray-300 hover:bg-gray-900"
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <ModalVerReembolso
        aberto={modalVerAberto}
        aoFechar={() => setModalVerAberto(false)}
        reembolso={reembolsoSelecionado}
        aoSalvar={handleSalvarReembolso}
      />

      <ModalFiltroReembolsos
        aberto={modalFiltroAberto}
        aoFechar={() => setModalFiltroAberto(false)}
        aoAplicar={handleAplicarFiltros}
        filtrosAtuais={filtrosAplicados}
      />
    </DashboardLayout>
  )
}
