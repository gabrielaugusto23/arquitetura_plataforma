// Tipos e constantes para Membros/Usuários do sistema

export type RoleMembro = 'Admin' | 'Membro'
export type StatusMembro = 'Ativo' | 'Inativo'

export interface Membro {
  id: string
  nome: string
  email: string
  telefone?: string
  departamento: string
  cargo: string
  role: RoleMembro
  dataCriacao: string
  ultimaAtualizacao: string
  status: StatusMembro
  foto?: string
  descricao?: string
}

export interface DadosMembro {
  nome: string
  email: string
  telefone?: string
  departamento: string
  cargo: string
  role: RoleMembro
  status?: StatusMembro
  descricao?: string
}

export const ROLES_MEMBRO: RoleMembro[] = ['Admin', 'Membro']
export const STATUS_MEMBRO: StatusMembro[] = ['Ativo', 'Inativo']

export const DEPARTAMENTOS = [
  'Vendas',
  'Suporte',
  'Desenvolvimento',
  'Design',
  'Marketing',
  'Financeiro',
  'Recursos Humanos',
  'Operações',
]

export const CARGOS = [
  'Gerente',
  'Coordenador',
  'Analista',
  'Especialista',
  'Assistente',
  'Estagiário',
  'Diretor',
]
