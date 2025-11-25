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
import {
  ROLES_MEMBRO,
  STATUS_MEMBRO,
  DEPARTAMENTOS,
  CARGOS,
  type Membro,
  type DadosMembro,
} from "@/types/membro"

interface ModalVerMembroProps {
  aberto: boolean
  aoFechar: () => void
  membro: Membro | null
  aoSalvarEdicao: (membroId: string, dados: DadosMembro) => Promise<void>
}

export function ModalVerMembro({
  aberto,
  aoFechar,
  membro,
  aoSalvarEdicao,
}: ModalVerMembroProps) {
  const { addNotification } = useAppContext()
  const [emEdicao, setEmEdicao] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [dados, setDados] = useState<DadosMembro>({
    nome: "",
    email: "",
    telefone: "",
    departamento: "Vendas",
    cargo: "Assistente",
    role: "Membro",
    status: "Ativo",
    descricao: "",
  })

  useEffect(() => {
    if (aberto && membro) {
      setDados({
        nome: membro.nome,
        email: membro.email,
        telefone: membro.telefone || "",
        departamento: membro.departamento,
        cargo: membro.cargo,
        role: membro.role,
        status: membro.status,
        descricao: membro.descricao || "",
      })
      setEmEdicao(false)
    }
  }, [aberto, membro])

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

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.nome.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o nome"
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

    if (!dados.telefone || !dados.telefone.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o telefone"
      })
      return
    }

    if (!membro) return

    setCarregando(true)

    try {
      await aoSalvarEdicao(membro.id, dados)

      addNotification({
        type: "success",
        message: "Membro atualizado com sucesso"
      })

      setEmEdicao(false)
      aoFechar()
    } catch (erro) {
      addNotification({
        type: "error",
        message: "Erro ao atualizar membro"
      })
      console.error("Erro ao atualizar membro:", erro)
    } finally {
      setCarregando(false)
    }
  }

  if (!membro) return null

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-white">
              {emEdicao ? "Editar Membro" : "Detalhes do Membro"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {emEdicao
                ? "Altere as informações do membro"
                : "Visualize e gerencie este membro"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {emEdicao ? (
          <form onSubmit={handleSalvarEdicao} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="nome" className="text-xs text-gray-400">
                Nome
              </Label>
              <Input
                id="nome"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
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
              <Label htmlFor="departamento" className="text-xs text-gray-400">
                Departamento
              </Label>
              <Select
                value={dados.departamento}
                onValueChange={(valor) =>
                  setDados({ ...dados, departamento: valor })
                }
              >
                <SelectTrigger id="departamento" className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  {DEPARTAMENTOS.map((depto) => (
                    <SelectItem key={depto} value={depto} className="text-xs">
                      {depto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="cargo" className="text-xs text-gray-400">
                Cargo
              </Label>
              <Select
                value={dados.cargo}
                onValueChange={(valor) =>
                  setDados({ ...dados, cargo: valor })
                }
              >
                <SelectTrigger id="cargo" className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  {CARGOS.map((cargo) => (
                    <SelectItem key={cargo} value={cargo} className="text-xs">
                      {cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role" className="text-xs text-gray-400">
                Função
              </Label>
              <Select
                value={dados.role}
                onValueChange={(valor) =>
                  setDados({ ...dados, role: valor as any })
                }
              >
                <SelectTrigger id="role" className="h-8 border-gray-800 bg-gray-950 text-xs text-white">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent className="border-gray-800 bg-black text-xs text-gray-200">
                  {ROLES_MEMBRO.map((role) => (
                    <SelectItem key={role} value={role} className="text-xs">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {STATUS_MEMBRO.map((status) => (
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
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-xs font-medium text-white">{membro.nome}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-xs text-gray-300">{membro.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-xs text-gray-300">{membro.telefone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Departamento</p>
                  <p className="text-xs text-gray-300">{membro.departamento}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cargo</p>
                  <p className="text-xs text-gray-300">{membro.cargo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Função</p>
                  <p className="text-xs text-gray-300">{membro.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getBadgeVariant(membro.status)}>
                    {membro.status}
                  </Badge>
                </div>
              </div>

              {membro.descricao && (
                <div>
                  <p className="text-xs text-gray-500">Descrição</p>
                  <p className="text-xs text-gray-300">{membro.descricao}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 border-t border-gray-700 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Criação</p>
                  <p className="text-xs text-gray-300">
                    {new Date(membro.dataCriacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Atualização</p>
                  <p className="text-xs text-gray-300">
                    {new Date(membro.ultimaAtualizacao).toLocaleDateString("pt-BR")}
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
