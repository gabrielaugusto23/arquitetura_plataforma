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
import { ModalNovoMembro } from "@/components/modal-novo-membro"
import { ModalVerMembro } from "@/components/modal-ver-membro"
import { type Membro, type DadosMembro } from "@/types/membro"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function MembrosPage() {
  const { addNotification } = useAppContext()
  const router = useRouter()

  const [membros, setMembros] = useState<Membro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalVerAberto, setModalVerAberto] = useState(false)
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(null)
  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")

  type UsuarioLogado = {
    id: string
    nome?: string
    email?: string
    role?: string
  }
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null) 

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('engnet_token') : null
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem('engnet_user')
    if (userStr) {
      try {
        setUsuarioLogado(JSON.parse(userStr))
      } catch (e) {
        console.error("Erro ao ler usuário logado")
      }
    }
  }, [])

  const carregarMembros = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        headers: getAuthHeaders()
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error('Erro ao carregar membros')

      const data = await res.json()

      const membrosFormatados: Membro[] = data.map((user: any) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        departamento: user.departamento,
        cargo: user.cargo,
        role: user.role,
        dataCriacao: user.dataCriacao,
        ultimaAtualizacao: user.ultimaAtualizacao || user.dataCriacao,
        status: user.ativo ? "Ativo" : "Inativo", 
        descricao: user.descricao
      }))

      setMembros(membrosFormatados)
    } catch (error) {
      console.error(error)
      addNotification({ type: "error", message: "Erro ao carregar lista de membros." })
    } finally {
      setCarregando(false)
    }
  }, [addNotification, router])

  useEffect(() => {
    carregarMembros()
  }, [carregarMembros])

  const criarMembro = async (dados: DadosMembro) => {
    try {
      const senhaProvisoria = "Engnet@2025"; 
      const payload = {
        ...dados,
        ativo: dados.status === "Ativo",
        senha: senhaProvisoria
      }

      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const erro = await res.json()
        throw new Error(erro.message || 'Erro ao criar membro')
      }

      addNotification({ type: "success", message: `Membro criado com sucesso! Senha provisória: ${senhaProvisoria}` })
      setModalNovoAberto(false)
      carregarMembros()
    } catch (error: any) {
      addNotification({ type: "error", message: error.message })
    }
  }

  const editarMembro = async (membroId: string, dados: DadosMembro) => {
    try {
      const payload = {
        ...dados,
        ativo: dados.status === "Ativo"
      }

      const res = await fetch(`${API_URL}/usuarios/${membroId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Erro ao atualizar membro')

      addNotification({ type: "success", message: "Membro atualizado com sucesso!" })
      carregarMembros()
    } catch (error: any) {
      addNotification({ type: "error", message: "Erro ao salvar alterações." })
    }
  }

  const deletarMembro = async (membroId: string) => {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return

    try {
      const res = await fetch(`${API_URL}/usuarios/${membroId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!res.ok) {
        const erro = await res.json()
        if (res.status === 400) {
            throw new Error(erro.message)
        }
        throw new Error('Erro ao excluir')
      }

      addNotification({ type: "success", message: "Membro excluído com sucesso!" })
      setMembros(prev => prev.filter(m => m.id !== membroId))
    } catch (error: any) {
      addNotification({ type: "error", message: error.message || "Erro ao excluir." })
    }
  }

  const membrosFiltrados = membros.filter((membro) => {
    const termo = busca.toLowerCase()
    const matchBusca =
      membro.nome.toLowerCase().includes(termo) ||
      membro.email.toLowerCase().includes(termo) ||
      (membro.departamento && membro.departamento.toLowerCase().includes(termo))

    const matchStatus =
      statusFiltro === "todos" ||
      membro.status.toLowerCase() === statusFiltro.toLowerCase()

    return matchBusca && matchStatus
  })

  const abrirModalVer = (membro: Membro) => {
    setMembroSelecionado(membro)
    setModalVerAberto(true)
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Inativo": return "bg-red-500/15 text-red-400 border-red-500/20"
      default: return "bg-gray-500/15 text-gray-400"
    }
  }

return (
    <DashboardLayout>
      <PageHeader
        title="Membros"
        description="Gerencie todos os membros da sua equipe"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Membros" }]}
        actions={
          usuarioLogado?.role === 'Admin' ? (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setModalNovoAberto(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Membro
            </Button>
          ) : null
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
              <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-950">
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
                  {carregando ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                  ) : (
                    <div className="max-h-[480px] overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-black">
                          <TableRow className="border-gray-800">
                            <TableHead className="text-gray-300">Nome</TableHead>
                            <TableHead className="text-gray-300">Email</TableHead>
                            <TableHead className="text-gray-300">Departamento</TableHead>
                            <TableHead className="text-gray-300">Cargo</TableHead>
                            {usuarioLogado?.role === 'Admin' && (
                                <TableHead className="text-gray-300">Função</TableHead>
                            )}

                            <TableHead className="text-gray-300">Status</TableHead>
                            {usuarioLogado?.role === 'Admin' && (
                                <TableHead className="text-gray-300">Ações</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {membrosFiltrados.length === 0 ? (
                            <TableRow>
                              <TableCell 
                                colSpan={usuarioLogado?.role === 'Admin' ? 7 : 5} 
                                className="text-center py-8 text-gray-500"
                              >
                                Nenhum membro encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            membrosFiltrados.map((membro, idx) => (
                              <TableRow
                                key={membro.id}
                                className={`border-gray-800 hover:bg-gray-950 ${
                                  idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"
                                }`}
                              >
                                <TableCell className="font-medium text-white">{membro.nome}</TableCell>
                                <TableCell className="text-gray-300">{membro.email}</TableCell>
                                <TableCell className="text-gray-300">{membro.departamento}</TableCell>
                                <TableCell className="text-gray-300">{membro.cargo}</TableCell>
                                {usuarioLogado?.role === 'Admin' && (
                                    <TableCell className="text-gray-300">{membro.role}</TableCell>
                                )}

                                <TableCell>
                                  <Badge className={getBadgeVariant(membro.status)}>
                                    {membro.status}
                                  </Badge>
                                </TableCell>
                                {usuarioLogado?.role === 'Admin' && (
                                    <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-orange-500 hover:bg-gray-900"
                                        onClick={() => abrirModalVer(membro)}
                                        >
                                        <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-900"
                                        onClick={() => deletarMembro(membro.id)}
                                        >
                                        <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    </TableCell>
                                )}
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
                        Mostrando {membrosFiltrados.length} de {membros.length} membros
                      </span>
                    </div>
                  )}
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