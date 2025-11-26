"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Trash2, Check, X, Loader2 } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAppContext } from "@/app/context/AppContext"
import { ModalVerReembolso } from "@/components/modal-ver-reembolso"
import { ModalFiltroReembolsos } from "@/components/modal-filtro-reembolsos"
import { FiltrosReembolso, Reembolso } from "@/types/reembolso"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ReembolsosPage() {
  const { addNotification, userInfo } = useAppContext()
  const router = useRouter()
  const isAdmin = userInfo?.role && userInfo.role.toUpperCase() === 'ADMIN';

  const [reembolsos, setReembolsos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<string>("Todas")
  
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false)
  const [reembolsoSelecionado, setReembolsoSelecionado] = useState<any | null>(null)
  
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosReembolso>({})

  const itensPorPagina = 10

  const getAuthHeaders = () => {
    const token = localStorage.getItem('engnet_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const carregarReembolsos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/reembolsos`, {
        headers: getAuthHeaders()
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error("Erro ao buscar dados")

      const data = await res.json()

      const dadosFormatados = data.map((item: any) => ({
        id: item.id,
        idReembolso: item.codigo || item.id.substring(0, 8).toUpperCase(),
        nomeFuncionario: item.usuario?.nome || "Desconhecido",
        categoria: item.categoria,
        descricao: item.descricao,
        valorReembolso: Number(item.valor),
        dataReembolso: item.dataDespesa,
        status: item.status,
        dataCriacao: item.criadoEm,
        ultimaAtualizacao: item.atualizadoEm,
        justificativa: item.justificativa,
        comprovanteUrl: item.comprovanteUrl,
        fullData: item 
      }))

      setReembolsos(dadosFormatados)
    } catch (error) {
      console.error(error)
      addNotification({ type: "error", message: "Erro ao carregar reembolsos." })
    } finally {
      setLoading(false)
    }
  }, [router, addNotification])

  useEffect(() => {
    carregarReembolsos()
  }, [carregarReembolsos])

  const handleAprovar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/reembolsos/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'Aprovado' }) 
      })
      if (!res.ok) throw new Error()
      
      addNotification({ type: "success", message: "Reembolso aprovado!" })
      carregarReembolsos()
    } catch (e) {
      addNotification({ type: "error", message: "Erro ao aprovar reembolso." })
    }
  }

  const handleRejeitar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/reembolsos/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'Rejeitado' })
      })
      if (!res.ok) throw new Error()

      addNotification({ type: "success", message: "Reembolso rejeitado." })
      carregarReembolsos()
    } catch (e) {
      addNotification({ type: "error", message: "Erro ao rejeitar reembolso." })
    }
  }

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este reembolso?")) return

    try {
      const res = await fetch(`${API_URL}/reembolsos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (!res.ok) throw new Error()

      addNotification({ type: "success", message: "Reembolso excluído com sucesso!" })
      setReembolsos(prev => prev.filter(r => r.id !== id))
    } catch (e) {
      addNotification({ type: "error", message: "Erro ao excluir." })
    }
  }

  const handleVerReembolso = (reembolso: any) => {
    setReembolsoSelecionado(reembolso.fullData || reembolso)
    setModalVerAberto(true)
  }

  const handleSalvarEdicaoModal = () => {
    carregarReembolsos()
    setModalVerAberto(false)
  }

  const limparFiltros = () => {
    setBusca("")
    setFiltrosAplicados({})
    setPaginaAtual(1)
  }

  const temFiltrosAtivos = busca.length > 0 || Object.keys(filtrosAplicados).length > 0

  const reembolsosFiltrados = reembolsos.filter((r) => {
    const termo = busca.toLowerCase()
    const matchBusca = 
      (r.idReembolso && r.idReembolso.toLowerCase().includes(termo)) ||
      (r.nomeFuncionario && r.nomeFuncionario.toLowerCase().includes(termo)) ||
      (r.categoria && r.categoria.toLowerCase().includes(termo)) ||
      (r.descricao && r.descricao.toLowerCase().includes(termo))
    
    const matchStatus = statusFiltro === "Todas" || r.status.toLowerCase() === statusFiltro.toLowerCase()
    
    const matchFiltrosAvancados = (!filtrosAplicados.nomeFuncionario || 
      r.nomeFuncionario.toLowerCase().includes(filtrosAplicados.nomeFuncionario.toLowerCase())) &&
      (!filtrosAplicados.categoria || r.categoria === filtrosAplicados.categoria) &&
      (!filtrosAplicados.status || r.status === filtrosAplicados.status)
    
    return matchBusca && matchStatus && matchFiltrosAvancados
  })

  const indexInicial = (paginaAtual - 1) * itensPorPagina
  const reembolsosPaginados = reembolsosFiltrados.slice(indexInicial, indexInicial + itensPorPagina)
  const totalPaginas = Math.ceil(reembolsosFiltrados.length / itensPorPagina)

  const handleAplicarFiltros = (filtros: FiltrosReembolso) => {
    setFiltrosAplicados(filtros)
    setPaginaAtual(1)
  }

  const formatarData = (data: string) => {
    if (!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
  }

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`
  }

  const getBadgeVariant = (status: string) => {
    const st = status ? status.toLowerCase() : ''
    if (st === 'rascunho') return "bg-gray-500/15 text-gray-400 border-gray-500/30"
    if (st === 'pendente') return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
    if (st === 'aprovado') return "bg-green-500/15 text-green-400 border-green-500/30"
    if (st === 'rejeitado') return "bg-red-500/15 text-red-400 border-red-500/30"
    return "bg-gray-500/15 text-gray-400 border-gray-500/30"
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
          <div className="flex gap-2">
            {temFiltrosAtivos && (
              <Button 
                variant="ghost" 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={limparFiltros}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
            <Button 
              variant="outline" 
              className="border-gray-800 text-gray-300 hover:bg-gray-900 flex items-center gap-2"
              onClick={() => setModalFiltroAberto(true)}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        <Tabs value={statusFiltro} onValueChange={(v) => {
          setStatusFiltro(v)
          setPaginaAtual(1)
        }} className="w-full">
          <TabsList className="border-b border-gray-800 bg-black grid w-full grid-cols-5">
            {['Todas', 'Rascunho', 'Pendente', 'Aprovado', 'Rejeitado'].map(tab => (
                <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="text-gray-400 data-[state=active]:text-orange-500"
                >
                    {tab === 'Todas' ? 'Todas' : tab + 's'} 
                </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={statusFiltro} className="mt-6">
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
            ) : reembolsosPaginados.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">Nenhum reembolso encontrado</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-950">
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
                              {/* Botões de Ação (SÓ PARA ADMIN) */}
                              {isAdmin && (reembolso.status === "Pendente" || reembolso.status === "PENDENTE") && (
                                <>
                                  <Button
                                    size="sm"
                                    className="h-8 bg-green-500 text-white hover:bg-green-600 flex items-center gap-1 px-2"
                                    onClick={() => handleAprovar(reembolso.id)}
                                    title="Aprovar"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8 bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1 px-2"
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
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {isAdmin && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                  onClick={() => handleExcluir(reembolso.id)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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
        aoSalvar={handleSalvarEdicaoModal}
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