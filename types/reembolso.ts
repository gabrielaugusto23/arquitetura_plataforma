// Tipos e interfaces para reembolsos

export type StatusReembolso = "Pendente" | "Aprovado" | "Rejeitado" | "Rascunho"

export type CategoriaReembolso = "Combustível" | "Alimentação" | "Material" | "Transporte" | "Hospedagem" | "Refeição" | "Outros"

// Interface principal de um reembolso
export interface Reembolso {
  id: string
  idReembolso: string
  nomeFuncionario: string
  categoria: CategoriaReembolso
  descricao: string
  valorReembolso: number
  dataReembolso: string
  status: StatusReembolso
  dataCriacao: string
  ultimaAtualizacao: string
  observacoes?: string
}

// Interface para criar/editar reembolso
export interface DadosReembolso {
  nomeFuncionario: string
  categoria: CategoriaReembolso
  descricao: string
  valorReembolso: number
  dataReembolso: string
  status: StatusReembolso
  observacoes?: string
}

// Interface para filtro de reembolso
export interface FiltrosReembolso {
  categoria?: CategoriaReembolso
  status?: StatusReembolso
  nomeFuncionario?: string
  busca?: string
}

// Constantes para categorias
export const CATEGORIAS_REEMBOLSO: CategoriaReembolso[] = [
  "Combustível",
  "Alimentação",
  "Material",
  "Transporte",
  "Hospedagem",
  "Refeição",
  "Outros"
]

// Constantes para status
export const STATUS_REEMBOLSO: StatusReembolso[] = [
  "Rascunho",
  "Pendente",
  "Aprovado",
  "Rejeitado"
]
