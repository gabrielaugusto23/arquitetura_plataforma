"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/app/context/AppContext"
import { ModalNovoMembro } from "@/components/modal-novo-membro"
import { ModalVerMembro } from "@/components/modal-ver-membro"
import { ROLES_MEMBRO, STATUS_MEMBRO, type Membro, type DadosMembro } from "@/types/membro"

// Dados mockados de membros
const MEMBROS_MOCKADOS: Membro[] = [
  {
    id: "M001",
    nome: "João Silva",
    email: "joao.silva@engnet.com",
    telefone: "(61) 99999-1234",
    departamento: "Vendas",
    cargo: "Gerente",
    role: "Admin",
    dataCriacao: new Date("2025-01-15").toISOString(),
    ultimaAtualizacao: new Date("2025-11-24").toISOString(),
    status: "Ativo",
    descricao: "Gerente de vendas responsável pelas operações comerciais",
  },
  {
    id: "M002",
    nome: "Maria Santos",
    email: "maria.santos@engnet.com",
    telefone: "(61) 98888-5678",
    departamento: "Suporte",
    cargo: "Especialista",
    role: "Membro",
    dataCriacao: new Date("2025-02-20").toISOString(),
    ultimaAtualizacao: new Date("2025-11-24").toISOString(),
    status: "Ativo",
    descricao: "Especialista em suporte técnico",
  },
  {
    id: "M003",
    nome: "Pedro Costa",
    email: "pedro.costa@engnet.com",
    telefone: "(61) 97777-9012",
    departamento: "Desenvolvimento",
    cargo: "Analista",
    role: "Membro",
    dataCriacao: new Date("2025-03-10").toISOString(),
    ultimaAtualizacao: new Date("2025-11-24").toISOString(),
    status: "Ativo",
    descricao: "Analista de sistemas especializado em arquitetura",
  },
  {
    id: "M004",
    nome: "Ana Oliveira",
    email: "ana.oliveira@engnet.com",
    telefone: "(61) 96666-3456",
    departamento: "Design",
    cargo: "Coordenador",
    role: "Membro",
    dataCriacao: new Date("2025-04-05").toISOString(),
    ultimaAtualizacao: new Date("2025-11-24").toISOString(),
    status: "Inativo",
    descricao: "Coordenadora de design e UX",
  },
  {
    id: "M005",
    nome: "Carlos Mendes",
    email: "carlos.mendes@engnet.com",
    telefone: "(61) 95555-7890",
    departamento: "Marketing",
    cargo: "Assistente",
    role: "Membro",
    dataCriacao: new Date("2025-05-12").toISOString(),
    ultimaAtualizacao: new Date("2025-11-24").toISOString(),
    status: "Ativo",
    descricao: "Assistente de marketing digital",
  },
]

export default function MembrosPage() {
  const { addNotification } = useAppContext()
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null)
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")
  const [membros, setMembros] = useState<Membro[]>(MEMBROS_MOCKADOS)

  const membrosFiltrados = membros.filter((membro) => {
    const matchBusca =
      membro.nome.toLowerCase().includes(busca.toLowerCase()) ||
      membro.email.toLowerCase().includes(busca.toLowerCase()) ||
      membro.departamento.toLowerCase().includes(busca.toLowerCase())

    const matchStatus =
      statusFiltro === "todos" ||
      membro.status.toLowerCase() === statusFiltro.toLowerCase()

    return matchBusca && matchStatus
  })

  const abrirModalVer = (membro: Membro) => {
    setMembroSelecionado(membro)
    setModalVerAberto(true)
  }

  const criarMembro = async (dados: DadosMembro) => {
    const novoMembro: Membro = {
      id: `M${Math.random().toString(36).substr(2, 9)}`,
      ...dados,
      dataCriacao: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      status: dados.status || "Ativo",
    }

    setMembros([novoMembro, ...membros])
    addNotification({
      type: "success",
      message: "Membro adicionado com sucesso!"
    })
  }

  const editarMembro = async (membroId: string, dados: DadosMembro) => {
    setMembros(
      membros.map((m) =>
        m.id === membroId
          ? {
              ...m,
              ...dados,
              ultimaAtualizacao: new Date().toISOString(),
            }
          : m
      )
    )
    addNotification({
      type: "success",
      message: "Membro atualizado com sucesso!"
    })
  }

  const deletarMembro = (membroId: string) => {
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      setMembros(membros.filter((m) => m.id !== membroId))
      addNotification({
        type: "success",
        message: "Membro excluído com sucesso!"
      })
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Inativo":
        return "bg-red-500/15 text-red-400 border-red-500/20"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Membros"
        description="Gerencie todos os membros da sua equipe"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Membros" }]}
        actions={
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setModalNovoAberto(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        }
      />

      <Card className="border-gray-800 bg-black">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, email ou departamento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gray-800 text-gray-300 hover:bg-gray-950"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Tabs value={statusFiltro} onValueChange={setStatusFiltro}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-950">
                {[
                  { v: "todos", l: "Todos" },
                  { v: "ativo", l: "Ativos" },
                  { v: "inativo", l: "Inativos" },
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
                          <TableHead className="text-gray-300">Nome</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Departamento</TableHead>
                          <TableHead className="text-gray-300">Cargo</TableHead>
                          <TableHead className="text-gray-300">Função</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {membrosFiltrados.map((membro, idx) => (
                          <TableRow
                            key={membro.id}
                            className={`border-gray-800 hover:bg-gray-950 ${
                              idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"
                            }`}
                          >
                            <TableCell className="font-medium text-white">
                              {membro.nome}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {membro.email}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {membro.departamento}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {membro.cargo}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {membro.role}
                            </TableCell>
                            <TableCell>
                              <Badge className={getBadgeVariant(membro.status)}>
                                {membro.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                  onClick={() => abrirModalVer(membro)}
                                  title="Visualizar/Editar"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                  onClick={() => deletarMembro(membro.id)}
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
                    <span>
                      Mostrando {membrosFiltrados.length} de {membros.length}{" "}
                      membros
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <ModalNovoMembro
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoEnviar={criarMembro}
      />

      {membroSelecionado && (
        <ModalVerMembro
          aberto={modalVerAberto}
          aoFechar={() => setModalVerAberto(false)}
          membro={membroSelecionado}
          aoSalvarEdicao={editarMembro}
        />
      )}
    </DashboardLayout>
  )
}
