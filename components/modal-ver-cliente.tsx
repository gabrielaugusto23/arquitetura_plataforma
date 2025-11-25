"use client"

import { useState, useEffect } from "react"
import { Edit2 } from "lucide-react"
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
import { useAppContext } from "@/app/context/AppContext"
import { ESTADOS, STATUS_CLIENTE, type Cliente, type DadosCliente } from "@/types/cliente"

interface ModalVerClienteProps {
  aberto: boolean
  aoFechar: () => void
  cliente: Cliente | null
  aoSalvarEdicao: (clienteId: string, dados: DadosCliente) => Promise<void>
}

export function ModalVerCliente({
  aberto,
  aoFechar,
  cliente,
  aoSalvarEdicao,
}: ModalVerClienteProps) {
  const { addNotification } = useAppContext()
  const [emEdicao, setEmEdicao] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [dados, setDados] = useState<DadosCliente>({
    nomeEmpresa: "",
    nomeContato: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "SP",
    cep: "",
    cnpj: "",
    status: "Novo",
    descricao: "",
  })

  useEffect(() => {
    if (aberto && cliente) {
      setDados({
        nomeEmpresa: cliente.nomeEmpresa,
        nomeContato: cliente.nomeContato,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco || "",
        cidade: cliente.cidade || "",
        estado: cliente.estado || "SP",
        cep: cliente.cep || "",
        cnpj: cliente.cnpj || "",
        status: cliente.status,
        descricao: cliente.descricao || "",
      })
      setEmEdicao(false)
    }
  }, [aberto, cliente])

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      case "Ativo":
        return "bg-green-500/15 text-green-400 border-green-500/20"
      case "Inativo":
        return "bg-red-500/15 text-red-400 border-red-500/20"
      case "Novo":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20"
      default:
        return ""
    }
  }

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.nomeEmpresa.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o nome da empresa"
      })
      return
    }

    if (!dados.nomeContato.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o nome do contato"
      })
      return
    }

    if (!dados.email.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o email"
      })
      return
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(dados.email)) {
      addNotification({
        type: "error",
        message: "Email inválido"
      })
      return
    }

    if (!dados.telefone.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o telefone"
      })
      return
    }

    if (!cliente) return

    setCarregando(true)

    try {
      await aoSalvarEdicao(cliente.id, dados)

      addNotification({
        type: "success",
        message: "Cliente atualizado com sucesso"
      })

      setEmEdicao(false)
      aoFechar()
    } catch (erro) {
      addNotification({
        type: "error",
        message: "Erro ao atualizar cliente"
      })
      console.error("Erro ao atualizar cliente:", erro)
    } finally {
      setCarregando(false)
    }
  }

  if (!cliente) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-white">
              {emEdicao ? "Editar Cliente" : "Detalhes do Cliente"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {emEdicao
                ? "Altere as informações do cliente"
                : "Visualize e gerencie este cliente"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {emEdicao ? (
          <form onSubmit={handleSalvarEdicao} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="nomeEmpresa" className="text-xs text-gray-400">
                Nome da Empresa
              </Label>
              <Input
                id="nomeEmpresa"
                value={dados.nomeEmpresa}
                onChange={(e) =>
                  setDados({ ...dados, nomeEmpresa: e.target.value })
                }
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="nomeContato" className="text-xs text-gray-400">
                Nome do Contato
              </Label>
              <Input
                id="nomeContato"
                value={dados.nomeContato}
                onChange={(e) =>
                  setDados({ ...dados, nomeContato: e.target.value })
                }
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs text-gray-400">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="telefone" className="text-xs text-gray-400">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={dados.telefone}
                onChange={(e) =>
                  setDados({ ...dados, telefone: e.target.value })
                }
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cnpj" className="text-xs text-gray-400">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                value={dados.cnpj}
                onChange={(e) => setDados({ ...dados, cnpj: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="endereco" className="text-xs text-gray-400">
                Endereço
              </Label>
              <Input
                id="endereco"
                value={dados.endereco}
                onChange={(e) =>
                  setDados({ ...dados, endereco: e.target.value })
                }
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="cidade" className="text-xs text-gray-400">
                  Cidade
                </Label>
                <Input
                  id="cidade"
                  value={dados.cidade}
                  onChange={(e) =>
                    setDados({ ...dados, cidade: e.target.value })
                  }
                  className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="estado" className="text-xs text-gray-400">
                  Estado
                </Label>
                <Select
                  value={dados.estado}
                  onValueChange={(valor) =>
                    setDados({ ...dados, estado: valor })
                  }
                >
                  <SelectTrigger id="estado" className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado} value={estado} className="text-xs">
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="cep" className="text-xs text-gray-400">
                CEP
              </Label>
              <Input
                id="cep"
                value={dados.cep}
                onChange={(e) => setDados({ ...dados, cep: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs text-gray-400">
                Status
              </Label>
              <Select
                value={dados.status}
                onValueChange={(valor) =>
                  setDados({ ...dados, status: valor as any })
                }
              >
                <SelectTrigger id="status" className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  {STATUS_CLIENTE.map((status) => (
                    <SelectItem key={status} value={status} className="text-xs">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="descricao" className="text-xs text-gray-400">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={dados.descricao}
                onChange={(e) =>
                  setDados({ ...dados, descricao: e.target.value })
                }
                className="min-h-[60px] border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmEdicao(false)}
                className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
                disabled={carregando}
              >
                {carregando ? "Salvando" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-950 p-3">
              <div>
                <p className="text-xs text-gray-500">Empresa</p>
                <p className="text-xs font-medium text-white">
                  {cliente.nomeEmpresa}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Contato</p>
                  <p className="text-xs text-gray-300">{cliente.nomeContato}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-xs text-gray-300">{cliente.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-xs text-gray-300">{cliente.telefone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CNPJ</p>
                  <p className="text-xs text-gray-300">{cliente.cnpj || "-"}</p>
                </div>
              </div>

              {cliente.endereco && (
                <div>
                  <p className="text-xs text-gray-500">Endereço</p>
                  <p className="text-xs text-gray-300">{cliente.endereco}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {cliente.cidade && (
                  <div>
                    <p className="text-xs text-gray-500">Cidade</p>
                    <p className="text-xs text-gray-300">{cliente.cidade}</p>
                  </div>
                )}
                {cliente.estado && (
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <p className="text-xs text-gray-300">{cliente.estado}</p>
                  </div>
                )}
                {cliente.cep && (
                  <div>
                    <p className="text-xs text-gray-500">CEP</p>
                    <p className="text-xs text-gray-300">{cliente.cep}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge className={getBadgeVariant(cliente.status)}>
                  {cliente.status}
                </Badge>
              </div>

              {cliente.descricao && (
                <div>
                  <p className="text-xs text-gray-500">Descrição</p>
                  <p className="text-xs text-gray-300">{cliente.descricao}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 border-t border-gray-700 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Criação</p>
                  <p className="text-xs text-gray-300">
                    {new Date(cliente.dataCriacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Atualização</p>
                  <p className="text-xs text-gray-300">
                    {new Date(cliente.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={aoFechar}
                className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => setEmEdicao(true)}
                className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Editar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
