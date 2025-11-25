"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Importante para redirecionar
import { Menu, Search, Bell, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppTopbarProps {
  onOpenSidebar?: () => void
}

interface UsuarioLogado {
  id: string
  nome: string
  email: string
  role: string
  avatar?: string
}

export function AppTopbar({ onOpenSidebar }: AppTopbarProps) {
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)

  // Carregar dados do usuário quando monta o componente
  useEffect(() => {
    const dadosUsuario = localStorage.getItem("engnet_user")
    if (dadosUsuario) {
      try {
        setUsuario(JSON.parse(dadosUsuario))
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e)
      }
    }
  }, [])

  // Função de Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("engnet_token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      
      if (token) {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error("Erro ao comunicar logout ao servidor", error)
    } finally {
      localStorage.removeItem("engnet_token")
      localStorage.removeItem("engnet_user")
      router.push("/login")
    }
  }

  const getIniciais = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white hover:bg-gray-900 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-1 hidden w-full max-w-md items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1 text-gray-200 ring-1 ring-transparent focus-within:ring-orange-500/40 lg:flex">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar (Ctrl + K)"
            className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-900"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1 text-left text-sm text-gray-200 hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                <Avatar className="h-7 w-7">
                  {/* Usa avatar do usuário ou imagem padrão */}
                  <AvatarImage src={usuario?.avatar || "/diverse-user-avatars.png"} alt={usuario?.nome || "Usuário"} />
                  <AvatarFallback className="bg-orange-500 text-white text-xs">
                    {usuario ? getIniciais(usuario.nome) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block max-w-[120px] truncate">
                  {usuario ? usuario.nome : "Carregando..."}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-gray-800 bg-gray-950 text-gray-200" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{usuario?.nome}</p>
                  <p className="text-xs leading-none text-gray-400">{usuario?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="focus:bg-gray-900 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-900 cursor-pointer">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem 
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}