// estrutura pra implementar o backend

import { type Relatorio, type DadosRelatorio, type FiltrosRelatorio } from "@/types/relatorio"

// URL base da API
const URL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Interface de resposta de erro
interface RespostaErro {
  mensagem: string
  erro?: string
  detalhes?: Record<string, string>
}

// Interface para resposta de lista paginada
interface RespostaPaginada {
  relatorios: Relatorio[]
  total: number
  pagina: number
  limite: number
}

/**
 * Serviço para gerenciar operações de relatórios via API
 */
export class ServicoRelatorios {
  /**
   * Cria um novo relatório
   * @param dados - Dados do relatório
   * @returns Relatório criado
   */
  static async criarRelatorio(dados: DadosRelatorio): Promise<Relatorio> {
    const formData = new FormData()

    // Adiciona dados n o formulério
    formData.append("nome", dados.nome)
    formData.append("categoria", dados.categoria)
    formData.append("tipo", dados.tipo)
    formData.append("periodo", dados.periodo)
    formData.append("ultimaAtualizacao", dados.ultimaAtualizacao)
    formData.append("status", dados.status)
    formData.append("descricao", dados.descricao || "")

    // Adiciona arquivo se fornecido
    if (dados.arquivo) {
      formData.append("arquivo", dados.arquivo)
    }

    try {
      const resposta = await fetch(`${URL_API}/relatorios`, {
        method: "POST",
        body: formData,
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        const erro = (await resposta.json()) as RespostaErro
        throw new Error(erro.mensagem || "Erro ao criar relatório")
      }

      return await resposta.json()
    } catch (erro) {
      console.error("Erro ao criar relatório:", erro)
      throw erro
    }
  }

  /**
   * Edição de um relatório existente
   * @param id - ID do relatório
   * @param dados - Dados atualizados
   * @returns Relatório atualizado
   */
  static async editarRelatorio(id: string, dados: DadosRelatorio): Promise<Relatorio> {
    const formData = new FormData()

    // Adiciona dados ao formulário
    formData.append("nome", dados.nome)
    formData.append("categoria", dados.categoria)
    formData.append("tipo", dados.tipo)
    formData.append("periodo", dados.periodo)
    formData.append("ultimaAtualizacao", dados.ultimaAtualizacao)
    formData.append("status", dados.status)
    formData.append("descricao", dados.descricao || "")

    // Adiciona arquivo se fornecido
    if (dados.arquivo) {
      formData.append("arquivo", dados.arquivo)
    }

    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}`, {
        method: "PUT",
        body: formData,
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        const erro = (await resposta.json()) as RespostaErro
        throw new Error(erro.mensagem || "Erro ao editar relatório")
      }

      return await resposta.json()
    } catch (erro) {
      console.error("Erro ao editar relatório:", erro)
      throw erro
    }
  }

  /**
   * Obtém lista de relatórios com filtros
   * @param filtros - Filtros a aplicar
   * @param pagina - Número da página
   * @param limite - Itens por página
   * @returns Lista paginada de relatórios
   */
  static async listarRelatorios(
    filtros?: FiltrosRelatorio,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespostaPaginada> {
    const parametros = new URLSearchParams()

    // paginação
    parametros.append("pagina", String(pagina))
    parametros.append("limite", String(limite))

    // Adiciona filtros se fornecidos
    if (filtros) {
      if (filtros.categoria) parametros.append("categoria", filtros.categoria)
      if (filtros.tipo) parametros.append("tipo", filtros.tipo)
      if (filtros.periodo) parametros.append("periodo", filtros.periodo)
      if (filtros.status) parametros.append("status", filtros.status)
      if (filtros.busca) parametros.append("busca", filtros.busca)
    }

    try {
      const resposta = await fetch(`${URL_API}/relatorios?${parametros.toString()}`, {
        method: "GET",
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        const erro = (await resposta.json()) as RespostaErro
        throw new Error(erro.mensagem || "Erro ao listar relatórios")
      }

      return await resposta.json()
    } catch (erro) {
      console.error("Erro ao listar relatórios:", erro)
      throw erro
    }
  }

  /**
   * relatório específico
   * @param id - ID do relatório
   * @returns Relatório encontrado
   */
  static async obterRelatorio(id: string): Promise<Relatorio> {
    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}`, {
        method: "GET",
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        const erro = (await resposta.json()) as RespostaErro
        throw new Error(erro.mensagem || "Erro ao obter relatório")
      }

      return await resposta.json()
    } catch (erro) {
      console.error("Erro ao obter relatório:", erro)
      throw erro
    }
  }

  /**
   * Deleta  relatório
   * @param id - ID do relatório a deletar
   */
  static async deletarRelatorio(id: string): Promise<void> {
    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}`, {
        method: "DELETE",
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        const erro = (await resposta.json()) as RespostaErro
        throw new Error(erro.mensagem || "Erro ao deletar relatório")
      }
    } catch (erro) {
      console.error("Erro ao deletar relatório:", erro)
      throw erro
    }
  }

  /**
   * relatório em formato CSV
   * @param id - ID do relatório
   */
  static async baixarRelatorio(id: string): Promise<void> {
    try {
      const resposta = await fetch(`${URL_API}/relatorios/${id}/download`, {
        method: "GET",
        headers: this.obterCabecalhos(),
      })

      if (!resposta.ok) {
        throw new Error("Erro ao baixar relatório")
      }

      // Obtem o nome do arquivo do header
      const nomeArquivo =
        resposta.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          ?.replace(/['"]/g, "") || "relatorio.csv"

      // Cria blob e baixa o arquivo
      const blob = await resposta.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = nomeArquivo
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (erro) {
      console.error("Erro ao baixar relatório:", erro)
      throw erro
    }
  }

  /**
   * Obtém cabeçalhos HTTP padrão para as requisições
   * @returns Objeto com headers
   */
  private static obterCabecalhos(): HeadersInit {
    return {
      // Adicione cabeçalhos comuns aqui, como autenticação
    }
  }
}

import { useState } from "react"

export function useServicoRelatorios() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const criarRelatorio = async (dados: DadosRelatorio): Promise<Relatorio | null> => {
    setCarregando(true)
    setErro(null)

    try {
      const resultado = await ServicoRelatorios.criarRelatorio(dados)
      return resultado
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return null
    } finally {
      setCarregando(false)
    }
  }

  const editarRelatorio = async (
    id: string,
    dados: DadosRelatorio
  ): Promise<Relatorio | null> => {
    setCarregando(true)
    setErro(null)

    try {
      const resultado = await ServicoRelatorios.editarRelatorio(id, dados)
      return resultado
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return null
    } finally {
      setCarregando(false)
    }
  }

  const listarRelatorios = async (
    filtros?: FiltrosRelatorio,
    pagina?: number,
    limite?: number
  ): Promise<RespostaPaginada | null> => {
    setCarregando(true)
    setErro(null)

    try {
      const resultado = await ServicoRelatorios.listarRelatorios(filtros, pagina, limite)
      return resultado
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return null
    } finally {
      setCarregando(false)
    }
  }

  const obterRelatorio = async (id: string): Promise<Relatorio | null> => {
    setCarregando(true)
    setErro(null)

    try {
      const resultado = await ServicoRelatorios.obterRelatorio(id)
      return resultado
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return null
    } finally {
      setCarregando(false)
    }
  }

  const deletarRelatorio = async (id: string): Promise<boolean> => {
    setCarregando(true)
    setErro(null)

    try {
      await ServicoRelatorios.deletarRelatorio(id)
      return true
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return false
    } finally {
      setCarregando(false)
    }
  }

  const baixarRelatorio = async (id: string): Promise<boolean> => {
    setCarregando(true)
    setErro(null)

    try {
      await ServicoRelatorios.baixarRelatorio(id)
      return true
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : "Erro desconhecido"
      setErro(mensagem)
      return false
    } finally {
      setCarregando(false)
    }
  }

  return {
    carregando,
    erro,
    criarRelatorio,
    editarRelatorio,
    listarRelatorios,
    obterRelatorio,
    deletarRelatorio,
    baixarRelatorio,
  }
}
