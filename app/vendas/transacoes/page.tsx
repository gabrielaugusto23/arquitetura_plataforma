"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { Eye, Trash2, MoreHorizontal, Plus } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import { Transacao, TIPOS_TRANSACAO, StatusTransacao } from "@/types/venda"
import { ModalNovaTransacao } from "@/components/modal-nova-transacao"
import { ModalVerTransacao } from "@/components/modal-ver-transacao"

// Mock data
const transacoesMock: Transacao[] = [
  {
    id: "1",
    numeroTransacao: "TRX-001",
    idVenda: "1",
    tipoTransacao: "Boleto",
    valorTransacao: 5000.00,
    dataTransacao: new Date(2024, 0, 15).toISOString(),
    quemRealizou: "Carlos Silva",
    arquivoPDF: "comprovante_trx001.pdf",
    statusTransacao: "Confirmada",
    descricao: "Pagamento referente à venda VND-001",
    dataCriacao: new Date(2024, 0, 15).toISOString(),
    ultimaAtualizacao: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: "2",
    numeroTransacao: "TRX-002",
    idVenda: "2",
    tipoTransacao: "PIX",
    valorTransacao: 3200.00,
    dataTransacao: new Date(2024, 0, 16).toISOString(),
    quemRealizou: "Ana Costa",
    statusTransacao: "Confirmada",
    descricao: "Pagamento referente à venda VND-002",
    dataCriacao: new Date(2024, 0, 16).toISOString(),
    ultimaAtualizacao: new Date(2024, 0, 16).toISOString(),
  },
  {
    id: "3",
    numeroTransacao: "TRX-003",
    idVenda: "1",
    tipoTransacao: "Transferencia",
    valorTransacao: 2500.00,
    dataTransacao: new Date(2024, 0, 17).toISOString(),
    quemRealizou: "Bruno Santos",
    arquivoPDF: "comprovante_trx003.pdf",
    statusTransacao: "Pendente",
    descricao: "Pagamento adicional referente à venda VND-001",
    dataCriacao: new Date(2024, 0, 17).toISOString(),
    ultimaAtualizacao: new Date(2024, 0, 17).toISOString(),
  },
  {
    id: "4",
    numeroTransacao: "TRX-004",
    idVenda: "3",
    tipoTransacao: "Cartao Credito",
    valorTransacao: 1800.00,
    dataTransacao: new Date(2024, 0, 18).toISOString(),
    quemRealizou: "Diana Lima",
    statusTransacao: "Confirmada",
    descricao: "Pagamento referente à venda VND-003",
    dataCriacao: new Date(2024, 0, 18).toISOString(),
    ultimaAtualizacao: new Date(2024, 0, 18).toISOString(),
  },
  {
    id: "5",
    numeroTransacao: "TRX-005",
    idVenda: "4",
    tipoTransacao: "Boleto",
    valorTransacao: 4200.00,
    dataTransacao: new Date(2024, 0, 19).toISOString(),
    quemRealizou: "Eduardo Rocha",
    arquivoPDF: "comprovante_trx005.pdf",
    statusTransacao: "Falha",
    descricao: "Tentativa de pagamento referente à venda VND-004",
    dataCriacao: new Date(2024, 0, 19).toISOString(),
    ultimaAtualizacao: new Date(2024, 0, 19).toISOString(),
  },
]

export default function TransacoesPage() {
  const { addNotification } = useAppContext()
  const [busca, setBusca] = useState("")
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [statusFiltro, setStatusFiltro] = useState<StatusTransacao | "Todas">("Todas")
  const [transacoes, setTransacoes] = useState(transacoesMock)

  const itensPorPagina = 10
  const transacoesFiltradas = transacoes.filter((t) => {
    const matchBusca = t.numeroTransacao.toLowerCase().includes(busca.toLowerCase()) ||
      t.quemRealizou.toLowerCase().includes(busca.toLowerCase()) ||
      (t.descricao?.toLowerCase().includes(busca.toLowerCase()) ?? false)
    const matchStatus = statusFiltro === "Todas" || t.statusTransacao === statusFiltro
    return matchBusca && matchStatus
  })

  const indexInicial = (paginaAtual - 1) * itensPorPagina
  const transacoesPaginadas = transacoesFiltradas.slice(indexInicial, indexInicial + itensPorPagina)
  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina)

  const handleCriarTransacao = async (dados: any) => {
    const novaTransacao: Transacao = {
      id: String(transacoes.length + 1),
      numeroTransacao: `TRX-${String(transacoes.length + 1).padStart(3, "0")}`,
      idVenda: dados.idVenda,
      tipoTransacao: dados.tipoTransacao,
      valorTransacao: dados.valorTransacao,
      dataTransacao: new Date().toISOString(),
      quemRealizou: dados.quemRealizou,
      arquivoPDF: dados.arquivoPDF || null,
      statusTransacao: dados.statusTransacao,
      descricao: dados.descricao,
      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
    }
    
    setTransacoes([novaTransacao, ...transacoes])
    setModalNovaAberto(false)
    setPaginaAtual(1)
    
    addNotification({
      type: "success",
      message: "Transação registrada com sucesso!"
    })
  }

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      setTransacoes(transacoes.filter((t) => t.id !== id))
      addNotification({
        type: "success",
        message: "Transação excluída com sucesso!"
      })
    }
  }

  const handleAbrirVer = (transacao: Transacao) => {
    setTransacaoSelecionada(transacao)
    setModalVerAberto(true)
  }

  const handleSalvarEdicao = (id: string, dados: any) => {
    setTransacoes(transacoes.map((t) => 
      t.id === id 
        ? {
            ...t,
            tipoTransacao: dados.tipoTransacao,
            valorTransacao: dados.valorTransacao,
            quemRealizou: dados.quemRealizou,
            descricao: dados.descricao,
            statusTransacao: dados.statusTransacao,
            ultimaAtualizacao: new Date().toISOString(),
          }
        : t
    ))
    setModalVerAberto(false)
    addNotification({
      type: "success",
      message: "Transação atualizada com sucesso!"
    })
  }

  const getBadgeVariant = (status: StatusTransacao) => {
    const variants: Record<StatusTransacao, string> = {
      "Confirmada": "bg-green-500/15 text-green-400 border-green-500/30",
      "Pendente": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      "Falha": "bg-red-500/15 text-red-400 border-red-500/30",
    }
    return variants[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  }

  const formatarData = (data: string | Date) => {
    const dataObj = typeof data === 'string' ? new Date(data) : data
    return dataObj.toLocaleDateString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Transações"
        description="Gerenciar transações de vendas"
        breadcrumbs={[{ label: "Vendas", href: "/vendas" }, { label: "Transações" }]}
      />

      <Card className="border-gray-800 bg-black p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Buscar por transação, executante ou descrição..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setPaginaAtual(1)
              }}
              className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-600"
            />
          </div>
          <Button onClick={() => setModalNovaAberto(true)} className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <Tabs value={statusFiltro} onValueChange={(v) => {
          setStatusFiltro(v as StatusTransacao | "Todas")
          setPaginaAtual(1)
        }} className="w-full">
          <TabsList className="border-b border-gray-800 bg-black">
            <TabsTrigger value="Todas" className="text-gray-400 data-[state=active]:text-orange-500">
              Todas
            </TabsTrigger>
            <TabsTrigger value="Confirmada" className="text-gray-400 data-[state=active]:text-orange-500">
              Confirmadas
            </TabsTrigger>
            <TabsTrigger value="Pendente" className="text-gray-400 data-[state=active]:text-orange-500">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="Falha" className="text-gray-400 data-[state=active]:text-orange-500">
              Falhas
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFiltro} className="mt-6">
            {transacoesPaginadas.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="text-gray-400">ID</TableHead>
                        <TableHead className="text-gray-400">ID Venda</TableHead>
                        <TableHead className="text-gray-400">Tipo</TableHead>
                        <TableHead className="text-gray-400">Valor</TableHead>
                        <TableHead className="text-gray-400">Quem Realizou</TableHead>
                        <TableHead className="text-gray-400">Data</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transacoesPaginadas.map((transacao) => (
                        <TableRow key={transacao.id} className="border-gray-800 hover:bg-gray-950/50">
                          <TableCell className="font-mono text-sm text-gray-300">{transacao.numeroTransacao}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-400">VND-{transacao.idVenda}</TableCell>
                          <TableCell className="text-sm text-gray-300">{transacao.tipoTransacao}</TableCell>
                          <TableCell className="font-semibold text-white">{formatarValor(transacao.valorTransacao)}</TableCell>
                          <TableCell className="text-sm text-gray-300">{transacao.quemRealizou}</TableCell>
                          <TableCell className="text-sm text-gray-400">{formatarData(transacao.dataTransacao)}</TableCell>
                          <TableCell>
                            <span className={`inline-block rounded px-2 py-1 text-xs font-medium border ${getBadgeVariant(transacao.statusTransacao)}`}>
                              {transacao.statusTransacao}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                onClick={() => handleAbrirVer(transacao)}
                                title="Visualizar detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                onClick={() => handleExcluir(transacao.id)}
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
                      Página {paginaAtual} de {totalPaginas} ({transacoesFiltradas.length} resultados)
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

      <ModalNovaTransacao
        aberto={modalNovaAberto}
        aoFechar={() => setModalNovaAberto(false)}
        aoEnviar={handleCriarTransacao}
      />

      {transacaoSelecionada && (
        <ModalVerTransacao
          aberto={modalVerAberto}
          aoFechar={() => setModalVerAberto(false)}
          transacao={transacaoSelecionada}
          aoSalvarEdicao={handleSalvarEdicao}
        />
      )}
    </DashboardLayout>
  )
}
