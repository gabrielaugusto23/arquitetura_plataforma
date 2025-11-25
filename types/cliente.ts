// Tipos e constantes para Clientes
// Sincronizado com backend (ClientEntity)

export type StatusCliente = 'VIP' | 'Ativo' | 'Inativo' | 'Novo'

export interface Cliente {
  id: string
  nomeEmpresa: string
  nomeContato: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  cnpj?: string
  dataCriacao: string
  ultimaAtualizacao: string
  status: StatusCliente
  descricao?: string
}

export interface DadosCliente {
  nomeEmpresa: string
  nomeContato: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  cnpj?: string
  status?: StatusCliente
  descricao?: string
}

export const STATUS_CLIENTE: StatusCliente[] = ['VIP', 'Ativo', 'Inativo', 'Novo']

export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]
