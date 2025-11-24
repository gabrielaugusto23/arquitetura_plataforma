"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, DollarSign, Package, Receipt, Users } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { useState } from "react"
import { ModalNovaTransacao } from "@/components/modal-nova-transacao"

export default function Dashboard() {
  const { addNotification, userInfo, setUserInfo } = useAppContext()
  const { navigate } = useSPANavigation()
  const [modalTransacaoAberto, setModalTransacaoAberto] = useState(false)

  const handleWelcomeUser = () => {
    if (!userInfo) {
      setUserInfo({
        id: "1",
        name: "João Silva", 
        email: "joao@empresa.com",
        role: "admin"
      })
      addNotification({
        type: "success",
        message: "Bem-vindo ao Sistema ERP!"
      })
    }
  }

  const criarTransacao = async (dados: any) => {
    addNotification({
      type: "success",
      message: "Transacao registrada com sucesso!"
    })
    setModalTransacaoAberto(false)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral do desempenho da empresa"
        actions={
          <div className="flex gap-2">
            <Button onClick={handleWelcomeUser}>
              {userInfo ? `Olá, ${userInfo.name}` : "Login"}
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setModalTransacaoAberto(true)}>
              Nova Transacao
            </Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Dashboard" }]}
      />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[{
          title: "Receita Total",
          icon: DollarSign,
          value: "R$ 45.231,89",
          delta: "+20.1% do mês passado",
          deltaIcon: ArrowUp,
          deltaClass: "text-green-400",
        }, {
          title: "Reembolsos Pendentes",
          icon: Receipt,
          value: "R$ 3.240,50",
          delta: "8 solicitações",
          deltaIcon: null,
          deltaClass: "text-yellow-400",
        }, {
          title: "Funcionários Ativos",
          icon: Users,
          value: "24",
          delta: "+2 este mês",
          deltaIcon: ArrowUp,
          deltaClass: "text-green-400",
        }, {
          title: "Produtos em Estoque",
          icon: Package,
          value: "1.234",
          delta: "32 com estoque baixo",
          deltaIcon: ArrowDown,
          deltaClass: "text-red-400",
        }].map((kpi, i) => (
          <Card key={i} className="border-gray-800 bg-black">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">{kpi.value}</div>
              <p className={`mt-1 flex items-center text-xs ${kpi.deltaClass}`}>
                {kpi.deltaIcon ? <kpi.deltaIcon className="mr-1 h-3 w-3" /> : null}
                {kpi.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seções */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Reembolsos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { nome: "João Silva - Combustível", quando: "Hoje, 14:30", valor: "R$ 120,00", status: "Pendente", classe: "text-yellow-400 bg-yellow-500/15" },
              { nome: "Maria Santos - Almoço Cliente", quando: "Ontem, 16:45", valor: "R$ 85,50", status: "Aprovado", classe: "text-green-400 bg-green-500/15" },
              { nome: "Pedro Costa - Material Escritório", quando: "2 dias atrás", valor: "R$ 245,30", status: "Pendente", classe: "text-yellow-400 bg-yellow-500/15" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-950 p-3">
                <div>
                  <p className="font-medium text-white">{r.nome}</p>
                  <p className="text-xs text-gray-500">{r.quando}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{r.valor}</p>
                  <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${r.classe}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-orange-500 text-white hover:bg-orange-600" asChild>
              <a href="/reembolsos/novo">Solicitar Reembolso</a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-800 text-gray-300 hover:bg-gray-950"
              asChild
            >
              <a href="/vendas">Nova Venda</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ModalNovaTransacao
        aberto={modalTransacaoAberto}
        aoFechar={() => setModalTransacaoAberto(false)}
        aoEnviar={criarTransacao}
      />
    </DashboardLayout>
  )
}
