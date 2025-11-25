// Tipos e interfaces para vendas e transacoes do sistema

export type StatusVenda = "Concluida" | "Pendente" | "Cancelada" | "Processando"

export type StatusTransacao = "Confirmada" | "Pendente" | "Falha"

export type CategoriaVenda = "Serviços Consultoria" | "Licenças Software" | "Suporte Técnico" | "Desenvolvimento Customizado" | "Implantação Sistema" | "Treinamento"

export type TipoTransacao = "Boleto" | "Transferencia" | "Cartao Credito" | "Cheque" | "PIX" | "Dinheiro"

// Interface principal de uma venda
export interface Venda {
  id: string
  numeroVenda: string
  nomeVendedor: string
  categoria: CategoriaVenda
  valorVenda: number
  dataVenda: string
  status: StatusVenda
  cliente: string
  descricao?: string
  dataCriacao: string
  ultimaAtualizacao: string
}

// Interface para criar/editar venda
export interface DadosVenda {
  nomeVendedor: string
  categoria: CategoriaVenda
  valorVenda: number
  dataVenda: string
  status: StatusVenda
  cliente: string
  descricao?: string
}

// Interface principal de transacao
export interface Transacao {
  id: string
  numeroTransacao: string
  idVenda: string
  tipoTransacao: TipoTransacao
  valorTransacao: number
  dataTransacao: string
  quemRealizou: string
  arquivoPDF?: string
  statusTransacao: StatusTransacao
  descricao?: string
  dataCriacao: string
  ultimaAtualizacao: string
}

// Interface para criar/editar transacao
export interface DadosTransacao {
  idVenda: string
  tipoTransacao: TipoTransacao
  valorTransacao: number
  dataTransacao: string
  quemRealizou: string
  arquivoPDF?: File
  statusTransacao: StatusTransacao
  descricao?: string
}

// Interface para filtro de venda
export interface FiltrosVenda {
  categoria?: CategoriaVenda
  status?: StatusVenda
  vendedor?: string
  busca?: string
}

// Interface para filtro de transacao
export interface FiltrosTransacao {
  tipoTransacao?: TipoTransacao
  status?: StatusTransacao
  busca?: string
}

// Constantes para categorias de venda
export const CATEGORIAS_VENDA: CategoriaVenda[] = [
  "Serviços Consultoria",
  "Licenças Software",
  "Suporte Técnico",
  "Desenvolvimento Customizado",
  "Implantação Sistema",
  "Treinamento"
]

// Constantes para tipos de transacao
export const TIPOS_TRANSACAO: TipoTransacao[] = [
  "Boleto",
  "Transferencia",
  "Cartao Credito",
  "Cheque",
  "PIX",
  "Dinheiro"
]

// Constantes para status de venda
export const STATUS_VENDA: StatusVenda[] = [
  "Concluida",
  "Pendente",
  "Cancelada",
  "Processando"
]

// Constantes para status de transacao
export const STATUS_TRANSACAO: StatusTransacao[] = [
  "Confirmada",
  "Pendente",
  "Falha"
]
