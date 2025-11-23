// ============================================================================
// UTILITÁRIO PARA EXPORTAÇÃO DE RELATÓRIOS EM EXCEL
// ============================================================================
// Funções para converter dados de relatórios em formato Excel (CSV)

import { type Relatorio } from "@/types/relatorio"

// Interface para dados de reembolso (para exportação específica)
export interface DadosReembolso {
  id: string
  funcionario: string
  categoria: string
  valor: number
  data: Date
  status: string
  descricao: string
}

/**
 * Exporta relatórios de reembolsos para arquivo CSV (compatível com Excel)
 * @param relatorios - Lista de relatórios a exportar
 * @param nomeArquivo - Nome do arquivo a ser baixado
 */
export function exportarRelatoriosEmCSV(
  relatorios: Relatorio[],
  nomeArquivo: string = "relatorios.csv"
): void {
  // Cabeçalhos da tabela
  const cabecalhos = [
    "ID",
    "Nome do Relatório",
    "Categoria",
    "Tipo",
    "Período",
    "Última Atualização",
    "Tamanho",
    "Status",
  ]

  // Converte os relatórios para linhas CSV
  const linhas = relatorios.map((rel) => [
    rel.id,
    rel.nome,
    rel.categoria,
    rel.tipo,
    rel.periodo,
    new Date(rel.ultimaAtualizacao).toLocaleString("pt-BR"),
    rel.tamanho,
    rel.status,
  ])

  // Cria o conteúdo CSV
  const conteudoCSV = criarCSV(cabecalhos, linhas)

  // Baixa o arquivo
  baixarArquivo(conteudoCSV, nomeArquivo, "text/csv;charset=utf-8;")
}

/**
 * Exporta dados de reembolsos para arquivo CSV
 * @param reembolsos - Lista de reembolsos a exportar
 * @param nomeArquivo - Nome do arquivo a ser baixado
 */
export function exportarReembolsosEmCSV(
  reembolsos: DadosReembolso[],
  nomeArquivo: string = "reembolsos.csv"
): void {
  // Cabeçalhos da tabela
  const cabecalhos = [
    "ID",
    "Funcionário",
    "Categoria",
    "Valor (R$)",
    "Data",
    "Status",
    "Descrição",
  ]

  // Converte os reembolsos para linhas CSV
  const linhas = reembolsos.map((reb) => [
    reb.id,
    reb.funcionario,
    reb.categoria,
    reb.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }),
    new Date(reb.data).toLocaleDateString("pt-BR"),
    reb.status,
    reb.descricao,
  ])

  // Cria o conteúdo CSV
  const conteudoCSV = criarCSV(cabecalhos, linhas)

  // Baixa o arquivo
  baixarArquivo(conteudoCSV, nomeArquivo, "text/csv;charset=utf-8;")
}

/**
 * Cria uma string CSV a partir de cabeçalhos e linhas
 * @param cabecalhos - Array com cabeçalhos das colunas
 * @param linhas - Array de arrays com dados das linhas
 * @returns String no formato CSV
 */
function criarCSV(
  cabecalhos: string[],
  linhas: (string | number)[][]
): string {
  // Escapa aspas duplas nas células
  const escaparCSV = (valor: string | number): string => {
    const str = String(valor)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Cria linha de cabeçalhos
  const linhaCabecalhos = cabecalhos.map(escaparCSV).join(",")

  // Cria linhas de dados
  const linhasDados = linhas
    .map((linha) => linha.map(escaparCSV).join(","))
    .join("\n")

  // Combina com separador de linha
  return `${linhaCabecalhos}\n${linhasDados}`
}

/**
 * Baixa um arquivo de texto
 * @param conteudo - Conteúdo do arquivo
 * @param nomeArquivo - Nome do arquivo
 * @param tipo - Tipo MIME do arquivo
 */
function baixarArquivo(
  conteudo: string,
  nomeArquivo: string,
  tipo: string
): void {
  // Cria um blob com o conteúdo
  const blob = new Blob([conteudo], { type: tipo })

  // Cria uma URL para o blob
  const urlBlob = URL.createObjectURL(blob)

  // Cria um elemento <a> temporário
  const link = document.createElement("a")
  link.href = urlBlob
  link.download = nomeArquivo

  // Adiciona ao documento e clica
  document.body.appendChild(link)
  link.click()

  // Remove o elemento e libera a URL
  document.body.removeChild(link)
  URL.revokeObjectURL(urlBlob)
}

/**
 * Exporta relatórios em formato Excel (XLSX) - requer biblioteca adicional
 * NOTA: Para usar esta função, instale: npm install xlsx
 * @param relatorios - Lista de relatórios a exportar
 * @param nomeArquivo - Nome do arquivo a ser baixado
 */
export function exportarRelatoriosEmExcel(
  relatorios: Relatorio[],
  nomeArquivo: string = "relatorios.xlsx"
): void {
  // IMPLEMENTAÇÃO FUTURA
  // Quando utilizar biblioteca XLSX:
  // 1. Instalar: npm install xlsx
  // 2. Implementar conversão de dados
  // 3. Criar arquivo Excel com formatação

  // Por enquanto, usar exportarRelatoriosEmCSV como alternativa
  console.warn(
    "Exportação em XLSX ainda não implementada. Usando CSV como alternativa."
  )
  exportarRelatoriosEmCSV(relatorios, nomeArquivo.replace(".xlsx", ".csv"))
}

/**
 * Formata um relatório para exibição no Excel
 * @param relatorio - Relatório a formatar
 * @returns Objeto formatado para exportação
 */
export function formatarRelatorioParaExportar(relatorio: Relatorio) {
  return {
    id: relatorio.id,
    nome: relatorio.nome,
    categoria: relatorio.categoria,
    tipo: relatorio.tipo,
    periodo: relatorio.periodo,
    ultimaAtualizacao: new Date(relatorio.ultimaAtualizacao).toLocaleString(
      "pt-BR"
    ),
    tamanho: relatorio.tamanho,
    status: relatorio.status,
    descricao: relatorio.descricao || "-",
    usuarioCriacao: relatorio.usuarioCriacao || "-",
    usuarioEdicao: relatorio.usuarioEdicao || "-",
  }
}

/**
 * Formata um reembolso para exibição no Excel
 * @param reembolso - Reembolso a formatar
 * @returns Objeto formatado para exportação
 */
export function formatarReembolsoParaExportar(reembolso: DadosReembolso) {
  return {
    id: reembolso.id,
    funcionario: reembolso.funcionario,
    categoria: reembolso.categoria,
    valor: reembolso.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }),
    data: new Date(reembolso.data).toLocaleDateString("pt-BR"),
    status: reembolso.status,
    descricao: reembolso.descricao,
  }
}
