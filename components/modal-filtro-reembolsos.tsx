"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiltrosReembolso, CATEGORIAS_REEMBOLSO, STATUS_REEMBOLSO } from "@/types/reembolso"
import { X } from "lucide-react"

interface ModalFiltroReembolsosProps {
  aberto: boolean
  aoFechar: () => void
  aoAplicar: (filtros: FiltrosReembolso) => void
  filtrosAtuais: FiltrosReembolso
}

export function ModalFiltroReembolsos({ aberto, aoFechar, aoAplicar, filtrosAtuais }: ModalFiltroReembolsosProps) {
  const [filtros, setFiltros] = useState<FiltrosReembolso>({
    nomeFuncionario: filtrosAtuais.nomeFuncionario || "",
    categoria: filtrosAtuais.categoria,
    status: filtrosAtuais.status,
  })

  const handleAplicar = () => {
    aoAplicar(filtros)
    aoFechar()
  }

  const handleLimpar = () => {
    setFiltros({
      nomeFuncionario: "",
      categoria: undefined,
      status: undefined,
    })
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="border-gray-800 bg-gray-950 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Filtrar Reembolsos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome do Funcionário */}
          <div className="space-y-2">
            <Label htmlFor="nomeFuncionario" className="text-gray-300 text-xs">
              Nome do Funcionário
            </Label>
            <Input
              id="nomeFuncionario"
              placeholder="Digite o nome..."
              value={filtros.nomeFuncionario || ""}
              onChange={(e) => setFiltros({ ...filtros, nomeFuncionario: e.target.value })}
              className="border-gray-800 bg-gray-900 text-white placeholder:text-gray-600 h-8 text-xs"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-gray-300 text-xs">
              Categoria
            </Label>
            <Select value={filtros.categoria || ""} onValueChange={(v) => setFiltros({ ...filtros, categoria: v as any })}>
              <SelectTrigger className="border-gray-800 bg-gray-900 text-white h-8 text-xs">
                <SelectValue placeholder="Selecione uma categoria..." />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-gray-900">
                <SelectItem value="__reset__" className="text-gray-300">Todas as categorias</SelectItem>
                {CATEGORIAS_REEMBOLSO.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-gray-300">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300 text-xs">
              Status
            </Label>
            <Select value={filtros.status || ""} onValueChange={(v) => setFiltros({ ...filtros, status: v as any })}>
              <SelectTrigger className="border-gray-800 bg-gray-900 text-white h-8 text-xs">
                <SelectValue placeholder="Selecione um status..." />
              </SelectTrigger>
              <SelectContent className="border-gray-800 bg-gray-900">
                <SelectItem value="__reset__" className="text-gray-300">Todos os status</SelectItem>
                {STATUS_REEMBOLSO.map((status) => (
                  <SelectItem key={status} value={status} className="text-gray-300">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="border-gray-800 text-gray-300 hover:bg-gray-900"
            onClick={handleLimpar}
          >
            Limpar
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleAplicar}
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
