"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import {
  CATEGORIAS_RELATORIO,
  PERIODOS_RELATORIO,
  STATUS_RELATORIO,
  TIPOS_POR_CATEGORIA,
  type FiltrosRelatorio,
  type CategoriaRelatorio,
} from "@/types/relatorio"

interface ComponenteFiltroRelatoriosProps {
  aoFiltrar: (filtros: FiltrosRelatorio) => void
  aoLimpar: () => void
}

export function ComponenteFiltroRelatorios({
  aoFiltrar,
  aoLimpar,
}: ComponenteFiltroRelatoriosProps) {
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    categoria: undefined,
    tipo: undefined,
    periodo: undefined,
    status: undefined,
    busca: "",
  })

  // Tipos disponíveis baseado na categoria selecionada
  const tiposDisponiveis = filtros.categoria
    ? TIPOS_POR_CATEGORIA[filtros.categoria as CategoriaRelatorio]
    : []

  // Verifica se há filtros ativos
  const temFiltrosAtivos =
    filtros.categoria ||
    filtros.tipo ||
    filtros.periodo ||
    filtros.status ||
    (filtros.busca?.trim() || false)

  const handleMudarCategoria = (novaCategoria: string) => {
    if (!novaCategoria) {
      // Se vazio, limpa a categoria e tipo
      const novosFiltros = {
        ...filtros,
        categoria: undefined,
        tipo: undefined,
      }
      setFiltros(novosFiltros)
      aoFiltrar(novosFiltros)
      return
    }

    const novosFiltros = {
      ...filtros,
      categoria: novaCategoria as CategoriaRelatorio,
      tipo: undefined, // Reseta tipo ao mudar categoria
    }
    setFiltros(novosFiltros)
    aoFiltrar(novosFiltros)
  }

  const handleMudarTipo = (novoTipo: string) => {
    if (!novoTipo) {
      const novosFiltros = {
        ...filtros,
        tipo: undefined,
      }
      setFiltros(novosFiltros)
      aoFiltrar(novosFiltros)
      return
    }

    const novosFiltros = {
      ...filtros,
      tipo: novoTipo,
    }
    setFiltros(novosFiltros)
    aoFiltrar(novosFiltros)
  }

  const handleMudarPeriodo = (novoPeriodo: string) => {
    if (!novoPeriodo) {
      const novosFiltros = {
        ...filtros,
        periodo: undefined,
      }
      setFiltros(novosFiltros)
      aoFiltrar(novosFiltros)
      return
    }

    const novosFiltros = {
      ...filtros,
      periodo: novoPeriodo as any,
    }
    setFiltros(novosFiltros)
    aoFiltrar(novosFiltros)
  }

  const handleMudarStatus = (novoStatus: string) => {
    if (!novoStatus) {
      const novosFiltros = {
        ...filtros,
        status: undefined,
      }
      setFiltros(novosFiltros)
      aoFiltrar(novosFiltros)
      return
    }

    const novosFiltros = {
      ...filtros,
      status: novoStatus as any,
    }
    setFiltros(novosFiltros)
    aoFiltrar(novosFiltros)
  }

  const handleMudarBusca = (novaBusca: string) => {
    const novosFiltros = {
      ...filtros,
      busca: novaBusca,
    }
    setFiltros(novosFiltros)
    aoFiltrar(novosFiltros)
  }

  const handleLimparFiltros = () => {
    setFiltros({
      categoria: undefined,
      tipo: undefined,
      periodo: undefined,
      status: undefined,
      busca: "",
    })
    aoLimpar()
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-950 p-4">
      {/* Campo de busca por nome */}
      <div>
        <label htmlFor="busca" className="text-xs text-gray-400">
          Buscar Relatório
        </label>
        <Input
          id="busca"
          placeholder="Digite o nome do relatório..."
          value={filtros.busca}
          onChange={(e) => handleMudarBusca(e.target.value)}
          className="mt-1 border-gray-800 bg-black text-white placeholder:text-gray-600"
        />
      </div>

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Filtro por categoria */}
        <div>
          <label htmlFor="categoria" className="text-xs text-gray-400">
            Categoria
          </label>
          <Select
            value={filtros.categoria || "vazio"}
            onValueChange={handleMudarCategoria}
          >
            <SelectTrigger className="mt-1 border-gray-800 bg-black text-gray-300">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-black text-gray-200">
              <SelectItem value="vazio">Todas as categorias</SelectItem>
              {CATEGORIAS_RELATORIO.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por tipo (dinâmico) */}
        <div>
          <label htmlFor="tipo" className="text-xs text-gray-400">
            Tipo
          </label>
          <Select
            value={filtros.tipo || "vazio"}
            onValueChange={handleMudarTipo}
          >
            <SelectTrigger
              className="mt-1 border-gray-800 bg-black text-gray-300"
              disabled={!filtros.categoria}
            >
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            {filtros.categoria && (
              <SelectContent className="border-gray-800 bg-black text-gray-200">
                <SelectItem value="vazio">Todos os tipos</SelectItem>
                {tiposDisponiveis.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </div>

        {/* Filtro por período */}
        <div>
          <label htmlFor="periodo" className="text-xs text-gray-400">
            Período
          </label>
          <Select
            value={filtros.periodo || "vazio"}
            onValueChange={handleMudarPeriodo}
          >
            <SelectTrigger className="mt-1 border-gray-800 bg-black text-gray-300">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-black text-gray-200">
              <SelectItem value="vazio">Todos os períodos</SelectItem>
              {PERIODOS_RELATORIO.map((periodo) => (
                <SelectItem key={periodo} value={periodo}>
                  {periodo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por status */}
        <div>
          <label htmlFor="status" className="text-xs text-gray-400">
            Status
          </label>
          <Select
            value={filtros.status || "vazio"}
            onValueChange={handleMudarStatus}
          >
            <SelectTrigger className="mt-1 border-gray-800 bg-black text-gray-300">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="border-gray-800 bg-black text-gray-200">
              <SelectItem value="vazio">Todos os status</SelectItem>
              {STATUS_RELATORIO.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      {temFiltrosAtivos && (
        <Button
          onClick={handleLimparFiltros}
          variant="outline"
          className="w-full border-gray-800 text-gray-300 hover:bg-gray-900"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      )}
    </div>
  )
}
