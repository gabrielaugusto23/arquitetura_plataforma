// Este arquivo contém as definições de tipos para o sistema de relatórios
// Aqui tentei deixar os dados comunicados com o backend através da API REST

// Status do reltório
export type StatusRelatorio = "Disponível" | "Processando" | "Erro" | "Arquivado"

// Categorias disponíveis para reltórios
export type CategoriaRelatorio = 
  | "Vendas"
  | "Estoque"
  | "Clientes"
  | "Financeiro"
  | "Análise"
  | "Reembolsos"

// Tipos de período para os relatórios
export type PeriodoRelatorio = 
  | "Diário"
  | "Semanal"
  | "Mensal"
  | "Trimestral"
  | "Anual"
  | "Personalizado"

// Interface principal de um relatório
export interface Relatorio {
  id: string
  nome: string
  categoria: CategoriaRelatorio
  tipo: string
  periodo: PeriodoRelatorio
  ultimaAtualizacao: Date | string
  tamanho: string
  status: StatusRelatorio
  descricao?: string
  usuarioCriacao: string
  usuarioEdicao?: string
  dataEdicao?: Date | string
  caminhoArquivo?: string
}

// Interface para criar/editar relatório
export interface DadosRelatorio {
  nome: string
  categoria: CategoriaRelatorio
  tipo: string
  periodo: PeriodoRelatorio
  ultimaAtualizacao: string 
  status: StatusRelatorio
  descricao?: string
  arquivo?: File
}

// Interface para resposta de filtro
export interface FiltrosRelatorio {
  categoria?: CategoriaRelatorio
  tipo?: string
  periodo?: PeriodoRelatorio
  status?: StatusRelatorio
  busca?: string
}

// Interface para paginação
export interface ResultadoPaginado {
  relatorios: Relatorio[]
  total: number
  pagina: number
  limite: number
}

// Constantes para categorias
export const CATEGORIAS_RELATORIO: CategoriaRelatorio[] = [
  "Vendas",
  "Estoque",
  "Clientes",
  "Financeiro",
  "Análise",
  "Reembolsos"
]

// Constantes para períods
export const PERIODOS_RELATORIO: PeriodoRelatorio[] = [
  "Diário",
  "Semanal",
  "Mensal",
  "Trimestral",
  "Anual",
  "Personalizado"
]

// Constantes para status
export const STATUS_RELATORIO: StatusRelatorio[] = [
  "Disponível",
  "Processando",
  "Erro",
  "Arquivado"
]

// Mapa de tipos por categoria
export const TIPOS_POR_CATEGORIA: Record<CategoriaRelatorio, string[]> = {
  "Vendas": ["Vendas Mensais", "Vendas Diárias", "Performance de Vendas", "Meta vs Realizado"],
  "Estoque": ["Estoque Detalhado", "Movimentação de Estoque", "Produtos Mais Vendidos", "Níveis Críticos"],
  "Clientes": ["Clientes Ativos", "Clientes Inativos", "Análise de Risco", "Satisfação do Cliente"],
  "Financeiro": ["Fluxo de Caixa", "Reembolsos Pendentes", "Contas a Pagar", "Contas a Receber"],
  "Análise": ["Análise Comparativa", "Tendências", "Previsões", "Índices de Desempenho"],
  "Reembolsos": ["Reembolsos por Funcionário", "Reembolsos por Categoria", "Status de Reembolsos", "Análise de Despesas"]
}
