"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CurrencyInput } from "@/components/currency-input"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/app/context/AppContext"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function NovoReembolsoPage() {
  const { addNotification, userInfo } = useAppContext()
  const router = useRouter()
  
  const [valor, setValor] = useState<number>(0)
  const [categoria, setCategoria] = useState<string>("Combustível")
  const [descricao, setDescricao] = useState("")
  const [justificativa, setJustificativa] = useState("")
  const [dataDespesa, setDataDespesa] = useState("")
  const [loading, setLoading] = useState(false)

  const totalFormatado = useMemo(
    () => (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    [valor],
  )

  const handleSave = async (statusFinal: 'Pendente' | 'Rascunho') => {
    setLoading(true)

    if (!valor || !descricao || !dataDespesa) {
        addNotification({ type: "warning", message: "Preencha todos os campos obrigatórios." })
        setLoading(false)
        return
    }

    try {
      const token = localStorage.getItem('engnet_token')
      
      const payload = {
        categoria,
        descricao,
        justificativa,
        valor,
        dataDespesa,
        status: statusFinal
      }

      const res = await fetch(`${API_URL}/reembolsos`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Erro ao criar reembolso')
      }

      addNotification({ 
        type: "success", 
        message: statusFinal === 'Rascunho' ? "Rascunho salvo!" : "Solicitação enviada com sucesso!" 
      })
      
      router.push('/reembolsos')

    } catch (error: any) {
        console.error(error)
        addNotification({ type: "error", message: error.message })
    } finally {
        setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Nova Solicitação de Reembolso"
        description="Preencha os dados para solicitar o reembolso de despesas"
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Reembolsos", href: "/reembolsos" },
          { label: "Nova" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Dados da Despesa</CardTitle>
              <CardDescription className="text-gray-400">
                Informe os detalhes da despesa que deseja reembolsar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-300">Funcionário</Label>
                  <Input 
                    value={userInfo?.nome || "Carregando..."} 
                    className="border-gray-800 bg-gray-950 text-white" 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Data da Despesa</Label>
                  <Input 
                    type="date" 
                    className="border-gray-800 bg-gray-950 text-white" 
                    required 
                    onChange={(e) => setDataDespesa(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-300">Categoria</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-black text-gray-200">
                      <SelectItem value="Combustível">Combustível</SelectItem>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Valor (R$)</Label>
                  <CurrencyInput
                    value={valor}
                    onValueChange={setValor}
                    placeholder="R$ 0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Descrição</Label>
                <Textarea
                  placeholder="Descreva o motivo da despesa..."
                  className="min-h-[100px] border-gray-800 bg-gray-950 text-white"
                  required
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Justificativa (Opcional)</Label>
                <Textarea
                  placeholder="Detalhes adicionais..."
                  className="min-h-[80px] border-gray-800 bg-gray-950 text-white"
                  onChange={(e) => setJustificativa(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Resumo</CardTitle>
              <CardDescription className="text-gray-400">Confira antes de enviar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400">Novo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Categoria</span>
                <span className="text-white capitalize">{categoria}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valor Total</span>
                <span className="font-medium text-white">{totalFormatado}</span>
              </div>
              
              <div className="pt-2 flex flex-col gap-2">
                <Button 
                    className="w-full bg-orange-500 text-white hover:bg-orange-600" 
                    onClick={() => handleSave('Pendente')}
                    disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Solicitação"}
                </Button>

                <Button 
                    variant="outline" 
                    className="w-full border-gray-800 text-gray-300 hover:bg-gray-950" 
                    onClick={() => handleSave('Rascunho')}
                    disabled={loading}
                >
                  Salvar Rascunho
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}