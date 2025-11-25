import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Em análise" | "Concluida" | "Cancelada" | "Processando" | "Rascunho" | "Confirmada" | "Falha"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps["status"], { bg: string; dot: string; text: string }> = {
    "Pendente": { bg: "bg-yellow-500/15", dot: "bg-yellow-400", text: "text-yellow-400" },
    "Aprovado": { bg: "bg-green-500/15", dot: "bg-green-400", text: "text-green-400" },
    "Rejeitado": { bg: "bg-red-500/15", dot: "bg-red-400", text: "text-red-400" },
    "Em análise": { bg: "bg-blue-500/15", dot: "bg-blue-400", text: "text-blue-400" },
    "Concluida": { bg: "bg-green-500/15", dot: "bg-green-400", text: "text-green-400" },
    "Cancelada": { bg: "bg-red-500/15", dot: "bg-red-400", text: "text-red-400" },
    "Processando": { bg: "bg-blue-500/15", dot: "bg-blue-400", text: "text-blue-400" },
    "Rascunho": { bg: "bg-gray-500/15", dot: "bg-gray-400", text: "text-gray-400" },
    "Confirmada": { bg: "bg-green-500/15", dot: "bg-green-400", text: "text-green-400" },
    "Falha": { bg: "bg-red-500/15", dot: "bg-red-400", text: "text-red-400" },
  }
  const c = map[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs", c.bg, c.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} aria-hidden="true" />
      {status}
    </span>
  )
}
