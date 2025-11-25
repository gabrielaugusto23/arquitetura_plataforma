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
import { ESTADOS, STATUS_CLIENTE, type DadosCliente } from "@/types/cliente"

interface ModalNovoClienteProps {
  aberto: boolean
  aoFechar: () => void
  aoEnviar: (dados: DadosCliente) => Promise<void>
}

export function ModalNovoCliente({
  aberto,
  aoFechar,
  aoEnviar,
}: ModalNovoClienteProps) {
  const { addNotification } = useAppContext()
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

  const handleEnviar = async (e: React.FormEvent) => {
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

    setCarregando(true)

    try {
      await aoEnviar(dados)

      setDados({
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
      aoFechar()
    } catch (erro) {
      addNotification({
        type: "error",
        message: "Erro ao criar cliente"
      })
      console.error("Erro ao criar cliente:", erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-h-[85vh] max-w-sm overflow-y-auto border-gray-800 bg-black sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Cliente</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informações para cadastrar um novo cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEnviar} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="nomeEmpresa" className="text-xs text-gray-400">
              Nome da Empresa *
            </Label>
            <Input
              id="nomeEmpresa"
              placeholder="Ex: Empresa ABC Ltda"
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
              Nome do Contato *
            </Label>
            <Input
              id="nomeContato"
              placeholder="Ex: João Silva"
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
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: contato@empresa.com"
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
              placeholder="Ex: (61) 3333-4444"
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
              CNPJ (opcional)
            </Label>
            <Input
              id="cnpj"
              placeholder="Ex: 00.000.000/0000-00"
              value={dados.cnpj}
              onChange={(e) => setDados({ ...dados, cnpj: e.target.value })}
              className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="endereco" className="text-xs text-gray-400">
              Endereço (opcional)
            </Label>
            <Input
              id="endereco"
              placeholder="Ex: Rua das Flores, 123"
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
                Cidade (opcional)
              </Label>
              <Input
                id="cidade"
                placeholder="Ex: Brasília"
                value={dados.cidade}
                onChange={(e) => setDados({ ...dados, cidade: e.target.value })}
                className="h-8 border-gray-800 bg-gray-950 text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="estado" className="text-xs text-gray-400">
                Estado (opcional)
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
              CEP (opcional)
            </Label>
            <Input
              id="cep"
              placeholder="Ex: 70000-000"
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
              Descrição (opcional)
            </Label>
            <Textarea
              id="descricao"
              placeholder="Informações adicionais sobre o cliente..."
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
              {carregando ? "Criando" : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
