import { type Relatorio, type DadosRelatorio, type FiltrosRelatorio, type CategoriaRelatorio, type PeriodoRelatorio, type StatusRelatorio } from "@/types/relatorio"

// URL base da API
const URL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Interface para tipagem do retorno do backend (pode variar do frontend)
interface RelatorioBackend {
  id: string
  nome: string
  categoria: string
  tipo: string
  periodo: string
  status: string
  descricao: string
  dataHora: string
  arquivoCsv?: string
  criadoEm: string
}

export class ServicoRelatorios {
  
  // Helper para pegar o token
  private static obterHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('engnet_token') : null
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  }

  /**
   * Cria um novo relatório
   */
  static async criarRelatorio(dados: DadosRelatorio): Promise<Relatorio> {
    // Adaptamos o objeto para o que o Backend espera (CreateRelatorioDto)
    const payload = {
      nome: dados.nome,
      categoria: dados.categoria,
      tipo: dados.tipo,
      periodo: dados.periodo,
      status: dados.status,
      descricao: dados.descricao || "",
      // O Backend espera uma string no arquivoCsv. 
      // Como não temos upload real ainda, enviamos o nome do arquivo ou null.
      arquivoCsv: dados.arquivo ? `/arquivos/${dados.arquivo.name}` : null,
      // Data atual se não vier nada
      dataHora: new Date().toISOString() 
    }

    try {
      const resposta = await fetch(`${URL_API}/relatorios`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: this.obterHeaders(),
      })

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}))
        throw new Error(erro.message || "Erro ao criar relatório")
      }

      const data: RelatorioBackend = await resposta.json()
      return this.mapearParaFrontend(data)
    } catch (erro) {
      console.error("Erro ao criar relatório:", erro)
      throw erro
    }
  }

  /**
   * Edição de um relatório existente
   */
  static async editarRelatorio(id: string, dados: DadosRelatorio): Promise<Relatorio> {
    const payload = {
      nome: dados.nome,
      categoria: dados.categoria,
      tipo: dados.tipo,
      periodo: dados.periodo,
      status: dados.status,
      descricao: dados.descricao,
      // Apenas atualiza o arquivo se um novo for enviado
      ...(dados.arquivo ? { arquivoCsv: `/arquivos/${dados.arquivo.name}` } : {})
    }

    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: this.obterHeaders(),
      })

      if (!resposta.ok) {
        throw new Error("Erro ao editar relatório")
      }

      const data: RelatorioBackend = await resposta.json()
      return this.mapearParaFrontend(data)
    } catch (erro) {
      console.error("Erro ao editar relatório:", erro)
      throw erro
    }
  }

  /**
   * Obtém lista de relatórios (O Backend atual retorna array direto, sem paginação no findAll simples)
   */
  static async listarRelatorios(): Promise<Relatorio[]> {
    try {
      const resposta = await fetch(`${URL_API}/relatorios`, {
        method: "GET",
        headers: this.obterHeaders(),
      })

      if (!resposta.ok) {
        if (resposta.status === 401) throw new Error("Não autorizado")
        throw new Error("Erro ao listar relatórios")
      }

      const listaBackend: RelatorioBackend[] = await resposta.json()
      
      // Mapeia a lista do formato Backend para Frontend
      return listaBackend.map(item => this.mapearParaFrontend(item))
    } catch (erro) {
      console.error("Erro ao listar relatórios:", erro)
      throw erro
    }
  }

  static async deletarRelatorio(id: string): Promise<void> {
    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}`, {
        method: "DELETE",
        headers: this.obterHeaders(),
      })

      if (!resposta.ok) {
        throw new Error("Erro ao deletar relatório")
      }
    } catch (erro) {
      throw erro
    }
  }

  // Função auxiliar para converter os dados do Backend para o tipo Relatorio do Frontend
  private static mapearParaFrontend(item: RelatorioBackend): Relatorio {
    // Converte a categoria (string do backend) para o tipo CategoriaRelatorio do frontend.
    // Usamos um cast seguro para atender a tipagem; se desejar validação extra, substitua por um mapeador que valide os valores permitidos.
    const categoria = item.categoria as unknown as CategoriaRelatorio
    // Converte o status (string do backend) para o tipo StatusRelatorio do frontend.
    // Usamos um cast seguro similar aos outros campos.
    const status = item.status as unknown as StatusRelatorio

    return {
      id: item.id,
      nome: item.nome,
      categoria: categoria,
      tipo: item.tipo,
      periodo: item.periodo as unknown as PeriodoRelatorio,
      // Mapeia dataHora (Backend) para ultimaAtualizacao (Frontend)
      ultimaAtualizacao: item.dataHora || item.criadoEm, 
      status: status,
      descricao: item.descricao,
      // Campos que o backend não tem ou tem nome diferente:
      tamanho: "Unknown", // Backend não salva tamanho por enquanto
      usuarioCriacao: "Sistema", // Backend não retorna o nome do usuário no findAll simples ainda
      caminhoArquivo: item.arquivoCsv
    }
  }
}