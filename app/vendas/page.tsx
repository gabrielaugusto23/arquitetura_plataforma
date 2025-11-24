"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Trash2, Eye } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { useAppContext } from "@/app/context/AppContext"
import { useState } from "react"
import { ModalNovaVenda } from "@/components/modal-nova-venda"
import { ModalVerVenda } from "@/components/modal-ver-venda"

export default function VendasPage() {
  const { addNotification } = useAppContext()
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [vendaSelecionada, setVendaSelecionada] = useState<any>(null)
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todas")
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  const vendasMockadas = [
    { id: "V001", numeroVenda: "VND-001", nomeVendedor: "João Silva", cliente: "Empresa ABC", categoria: "Serviços Consultoria", valorVenda: 5000.00, data: "10/11/2025", status: "Concluida" },
    { id: "V002", numeroVenda: "VND-002", nomeVendedor: "Maria Santos", cliente: "Empresa XYZ", categoria: "Licenças Software", valorVenda: 3200.50, data: "09/11/2025", status: "Pendente" },
    { id: "V003", numeroVenda: "VND-003", nomeVendedor: "Pedro Costa", cliente: "Empresa DEF", categoria: "Desenvolvimento Customizado", valorVenda: 8500.00, data: "08/11/2025", status: "Concluida" },
    { id: "V004", numeroVenda: "VND-004", nomeVendedor: "Ana Oliveira", cliente: "Empresa GHI", categoria: "Suporte Técnico", valorVenda: 1500.00, data: "07/11/2025", status: "Cancelada" },
    { id: "V005", numeroVenda: "VND-005", nomeVendedor: "Carlos Mendes", cliente: "Empresa JKL", categoria: "Implantação Sistema", valorVenda: 12000.00, data: "06/11/2025", status: "Processando" },
  ]

  const vendaFiltradas = vendasMockadas.filter((venda) => {
    const matchBusca = 
      venda.nomeVendedor.toLowerCase().includes(busca.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      venda.numeroVenda.toLowerCase().includes(busca.toLowerCase())
    
    const matchStatus = 
      statusFiltro === "todas" ||
      venda.status.toLowerCase() === statusFiltro.toLowerCase()
    
    return matchBusca && matchStatus
  })

  const abrirModalVer = (venda: any) => {
    setVendaSelecionada(venda)
    setModalVerAberto(true)
  }

  const criarVenda = async (dados: any) => {
    addNotification({
      type: "success",
      message: "Venda criada com sucesso!"
    })
    setModalNovaAberto(false)
  }

  const editarVenda = async (id: string, dados: any) => {
    addNotification({
      type: "success",
      message: "Venda atualizada com sucesso!"
    })
    setModalVerAberto(false)
  }

  const deletarVenda = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      addNotification({
        type: "success",
        message: "Venda excluída com sucesso!"
      })
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendas"
        description="Gerencie todas as vendas realizadas"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Vendas" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-900" asChild>
              <Link href="/vendas/transacoes">
                Transações
              </Link>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setModalNovaAberto(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        }
      />

      <Card className="border-gray-800 bg-black">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por vendedor, cliente ou número..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Tabs value={statusFiltro} onValueChange={setStatusFiltro}>
              <TabsList className="grid w-full grid-cols-5 bg-gray-950">
                {[
                  { v: "todas", l: "Todas" },
                  { v: "concluida", l: "Concluídas" },
                  { v: "pendente", l: "Pendentes" },
                  { v: "processando", l: "Processando" },
                  { v: "cancelada", l: "Canceladas" },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    {t.l}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={statusFiltro} className="mt-4">
                <div className="rounded-lg border border-gray-800">
                  <div className="max-h-[480px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-black">
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">ID</TableHead>
                          <TableHead className="text-gray-300">Vendedor</TableHead>
                          <TableHead className="text-gray-300">Cliente</TableHead>
                          <TableHead className="text-gray-300">Categoria</TableHead>
                          <TableHead className="text-gray-300">Valor</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendaFiltradas.map((venda, idx) => (
                          <TableRow
                            key={venda.id}
                            className={`border-gray-800 hover:bg-gray-950 ${idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"}`}
                          >
                            <TableCell className="font-mono text-white">{venda.numeroVenda}</TableCell>
                            <TableCell className="text-white">{venda.nomeVendedor}</TableCell>
                            <TableCell className="text-white">{venda.cliente}</TableCell>
                            <TableCell className="text-white text-xs">{venda.categoria}</TableCell>
                            <TableCell className="text-white">R$ {venda.valorVenda.toFixed(2)}</TableCell>
                            <TableCell className="text-white">{venda.data}</TableCell>
                            <TableCell className="text-white">
                              <StatusBadge status={venda.status as any} />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                  onClick={() => abrirModalVer(venda)}
                                  title="Visualizar/Editar"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                  onClick={() => deletarVenda(venda.id)}
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

                  <div className="flex items-center justify-between border-t border-gray-800 bg-black px-3 py-2 text-sm text-gray-400">
                    <span>Mostrando 1–5 de 28 vendas</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                        Próximo
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <ModalNovaVenda
        aberto={modalNovaAberto}
        aoFechar={() => setModalNovaAberto(false)}
        aoEnviar={criarVenda}
      />

      {vendaSelecionada && (
        <ModalVerVenda
          aberto={modalVerAberto}
          aoFechar={() => setModalVerAberto(false)}
          venda={vendaSelecionada}
          aoSalvarEdicao={editarVenda}
        />
      )}
    </DashboardLayout>
  )
}
