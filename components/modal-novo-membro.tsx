"use client"

import { useState } from "react"
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
import { useAppContext } from "@/app/context/AppContext"
import {
  ROLES_MEMBRO,
  STATUS_MEMBRO,
  DEPARTAMENTOS,
  CARGOS,
  type DadosMembro,
} from "@/types/membro"

interface ModalNovoMembroProps {
  aberto: boolean
  aoFechar: () => void
  aoEnviar: (dados: DadosMembro) => Promise<void>
}

export function ModalNovoMembro({
  aberto,
  aoFechar,
  aoEnviar,
}: ModalNovoMembroProps) {
  const { addNotification } = useAppContext()
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

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dados.nome.trim()) {
      addNotification({
        type: "error",
        message: "Preencha o nome do membro"
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

    setCarregando(true)

    try {
      await aoEnviar(dados)

      setDados({
        nome: "",
        email: "",
        telefone: "",
        departamento: "Vendas",
        cargo: "Assistente",
        role: "Membro",
        status: "Ativo",
        descricao: "",
      })
      aoFechar()
    } catch (erro) {
      addNotification({
        type: "error",
        message: "Erro ao criar membro"
      })
      console.error("Erro ao criar membro:", erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Membro</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informações para adicionar um novo membro
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnviar} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="nome" className="text-xs text-gray-400">
              Nome *
            </Label>
            <Input
              id="nome"
              placeholder="Ex: João Silva"
              value={dados.nome}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs text-gray-400">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: joao@empresa.com"
              value={dados.email}
              onChange={(e) => setDados({ ...dados, email: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefone" className="text-xs text-gray-400">
              Telefone *
            </Label>
            <Input
              id="telefone"
              placeholder="Ex: (61) 99999-9999"
              value={dados.telefone}
              onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
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
              onValueChange={(valor) => setDados({ ...dados, cargo: valor })}
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
            <Label htmlFor="descricao" className="text-xs text-gray-400">
              Descrição (opcional)
            </Label>
            <Textarea
              id="descricao"
              placeholder="Informações adicionais sobre o membro..."
              value={dados.descricao}
              onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              className="min-h-[60px] border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
            />
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={aoFechar}
              className="h-8 border-gray-800 text-xs text-gray-300 hover:bg-gray-950"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              disabled={carregando}
            >
              {carregando ? "Adicionando" : "Adicionar Membro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
