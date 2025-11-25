"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/app/context/AppContext"
import { ModalNovoCliente } from "@/components/modal-novo-cliente"
import { ModalVerCliente } from "@/components/modal-ver-cliente"
import { type DadosCliente } from "@/types/cliente"


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ClienteBackend {
  id: string
  nomeEmpresa: string
  nome: string
  email: string
  telefone: string
  cidade?: string
  status: string
  [key: string]: any
}

export default function ClientesPage() {
  const { addNotification } = useAppContext()
  const router = useRouter()
  
  const [clientes, setClientes] = useState<ClienteBackend[]>([])
  const [carregando, setCarregando] = useState(true)
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteBackend | null>(null)
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")

  const getAuthHeaders = () => {
    const token = localStorage.getItem('engnet_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // buscar clientes
  const carregarClientes = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/clientes`, {
        headers: getAuthHeaders()
      })

      if (res.status === 401) {
        router.push('/login') // Token expirou
        return
      }

      if (!res.ok) throw new Error('Erro ao carregar clientes')

      const data = await res.json()
      setClientes(data)
    } catch (error) {
      console.error(error)
      addNotification({ type: "error", message: "Não foi possível carregar a lista de clientes." })
    } finally {
      setCarregando(false)
    }
  }, [addNotification, router])

  useEffect(() => {
    carregarClientes()
  }, [carregarClientes])

  // criar
  const criarCliente = async (dados: DadosCliente) => {
    try {
      // mapeando nomeContato do form para nome do backend
      const payload = {
        ...dados,
        nome: dados.nomeContato, 
      }

      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const erro = await res.json()
        throw new Error(erro.message || 'Erro ao criar cliente')
      }

      addNotification({ type: "success", message: "Cliente criado com sucesso!" })
      setModalNovoAberto(false)
      carregarClientes()
    } catch (error: any) {
      addNotification({ type: "error", message: error.message })
    }
  }

  // editar
  const editarCliente = async (clienteId: string, dados: DadosCliente) => {
    try {
      const payload = {
        ...dados,
        nome: dados.nomeContato,
      }

      const res = await fetch(`${API_URL}/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Erro ao atualizar cliente')

      addNotification({ type: "success", message: "Cliente atualizado com sucesso!" })
      setModalVerAberto(false)
      carregarClientes()
    } catch (error: any) {
      addNotification({ type: "error", message: "Erro ao salvar alterações." })
    }
  }

  // deletar
  const deletarCliente = async (clienteId: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    try {
      const res = await fetch(`${API_URL}/clientes/${clienteId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!res.ok) throw new Error('Erro ao excluir')

      addNotification({ type: "success", message: "Cliente excluído com sucesso!" })
      // Remove 
      setClientes(prev => prev.filter(c => c.id !== clienteId))
    } catch (error) {
      addNotification({ type: "error", message: "Não foi possível excluir. O cliente pode ter vendas vinculadas." })
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = busca.toLowerCase()
    const matchBusca =
      cliente.nomeEmpresa.toLowerCase().includes(termo) ||
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo)

    const matchStatus =
      statusFiltro === "todos" ||
      (cliente.status && cliente.status.toLowerCase() === statusFiltro.toLowerCase())

    return matchBusca && matchStatus
  })

  const abrirModalVer = (cliente: ClienteBackend) => {
    setClienteSelecionado(cliente)
    setModalVerAberto(true)
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "VIP": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      case "Ativo": return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Inativo": return "bg-red-500/15 text-red-400 border-red-500/20"
      case "Novo": return "bg-blue-500/15 text-blue-400 border-blue-500/20"
      default: return "bg-gray-500/15 text-gray-400"
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes da empresa"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clientes" }]}
        actions={
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setModalNovoAberto(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        }
      />

      <Card className="border-gray-800 bg-black">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por empresa, contato ou email..."
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
                  { v: "todos", l: "Todos" },
                  { v: "vip", l: "VIP" },
                  { v: "ativo", l: "Ativos" },
                  { v: "inativo", l: "Inativos" },
                  { v: "novo", l: "Novos" },
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
                  {carregando ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                  ) : (
                    <div className="max-h-[480px] overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-black">
                          <TableRow className="border-gray-800">
                            <TableHead className="text-gray-300">Empresa</TableHead>
                            <TableHead className="text-gray-300">Contato</TableHead>
                            <TableHead className="text-gray-300">Email</TableHead>
                            <TableHead className="text-gray-300">Telefone</TableHead>
                            <TableHead className="text-gray-300">Cidade</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientesFiltrados.length === 0 ? (
                            <TableRow className="border-gray-800">
                              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                Nenhum cliente encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            clientesFiltrados.map((cliente, idx) => (
                              <TableRow
                                key={cliente.id}
                                className={`border-gray-800 hover:bg-gray-950 ${
                                  idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"
                                }`}
                              >
                                <TableCell className="font-medium text-white">
                                  {cliente.nomeEmpresa}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {cliente.nome}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {cliente.email}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {cliente.telefone}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {cliente.cidade || "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getBadgeVariant(cliente.status)}>
                                    {cliente.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                      onClick={() => abrirModalVer(cliente)}
                                      title="Visualizar/Editar"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                      onClick={() => deletarCliente(cliente.id)}
                                      title="Excluir"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {!carregando && (
                    <div className="flex items-center justify-between border-t border-gray-800 bg-black px-3 py-2 text-sm text-gray-400">
                      <span>
                        Mostrando {clientesFiltrados.length} de {clientes.length}{" "}
                        clientes
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <ModalNovoCliente
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoEnviar={criarCliente}
      />

      {clienteSelecionado && (
        <ModalVerCliente
          aberto={modalVerAberto}
          aoFechar={() => setModalVerAberto(false)}
          cliente={clienteSelecionado as any}
          aoSalvarEdicao={editarCliente}
        />
      )}
    </DashboardLayout>
  )
}