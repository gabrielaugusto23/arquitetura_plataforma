const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface FetchOptions extends RequestInit {
  timeout?: number
}

async function fetchComTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (erro) {
    clearTimeout(timeoutId)
    throw erro
  }
}

async function validarResposta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Erro ${response.status}: ${errorData.message || response.statusText}`
    )
  }

  // Para DELETE (204 No Content), retornar objeto vazio
  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}

// SERVIÇO DE USUÁRIOS (MEMBROS)

export interface UsuarioRequest {
  nome: string
  email: string
  telefone: string
  departamento?: string
  cargo?: string
  role?: string
  status?: string
  descricao?: string
}

export interface UsuarioResponse extends UsuarioRequest {
  id: string
  dataCriacao: string
  ultimaAtualizacao: string
}

export const usuariosService = {
   // Criar novo usuário (membro)
  async criar(dados: UsuarioRequest): Promise<UsuarioResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
    return validarResposta<UsuarioResponse>(response)
  },

   // Listar todos os usuários

  async listarTodos(): Promise<UsuarioResponse[]> {
    const response = await fetchComTimeout(`${API_BASE_URL}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<UsuarioResponse[]>(response)
  },

  
   // Buscar usuário por ID
   
  async obterPorId(id: string): Promise<UsuarioResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/usuarios/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<UsuarioResponse>(response)
  },

  
// Atualizar usuário
   
  async atualizar(id: string, dados: Partial<UsuarioRequest>): Promise<UsuarioResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/usuarios/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
    return validarResposta<UsuarioResponse>(response)
  },

  
   // Deletar usuário
   
  async deletar(id: string): Promise<void> {
    const response = await fetchComTimeout(`${API_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<void>(response)
  },
}

// SERVIÇO DE CLIENTES

export interface ClienteRequest {
  nomeEmpresa: string
  nomeContato: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  cnpj?: string
  status?: string
  descricao?: string
}

export interface ClienteResponse extends ClienteRequest {
  id: string
  dataCriacao: string
  ultimaAtualizacao: string
}

export const clientesService = {
   // Criar novo cliente
  async criar(dados: ClienteRequest): Promise<ClienteResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
    return validarResposta<ClienteResponse>(response)
  },

  // Listar todos os clientes

  async listarTodos(): Promise<ClienteResponse[]> {
    const response = await fetchComTimeout(`${API_BASE_URL}/clientes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<ClienteResponse[]>(response)
  },

    // Buscar cliente por ID
  
  async obterPorId(id: string): Promise<ClienteResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/clientes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<ClienteResponse>(response)
  },

  
   // Atualizar cliente
   
  async atualizar(id: string, dados: Partial<ClienteRequest>): Promise<ClienteResponse> {
    const response = await fetchComTimeout(`${API_BASE_URL}/clientes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
    return validarResposta<ClienteResponse>(response)
  },

   // Deletar cliente
   
  async deletar(id: string): Promise<void> {
    const response = await fetchComTimeout(`${API_BASE_URL}/clientes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return validarResposta<void>(response)
  },
}


export const apiService = {
  usuarios: usuariosService,
  clientes: clientesService,
}

export default apiService
