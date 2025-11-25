"use client"

import { useState } from "react"
import { useAppContext } from "@/app/context/AppContext"
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import Image from "next/image"

export default function LoginPage() {
  const { login } = useAppContext()
  
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(false)

  // validacao campos
  const validarCampos = () => {
    setErro("");
    
    if (!email) {
      setErro("Por favor, digite seu email.");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("Endereço de email inválido.");
      return false;
    }

    if (!senha) {
      setErro("Por favor, digite sua senha.");
      return false;
    } 
    
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarCampos()) return;

    setLoading(true)

    try {
      await login(email, senha)
    } catch (err: any) {
      setErro(err.message || "Email ou senha incorretos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-black p-8 shadow-[0_0_50px_-12px_rgba(249,115,22,0.1)]">
        
        {/* header */}
        <div className="flex flex-col items-center text-center">
          
          <div className="flex items-center justify-center gap-3 mb-2">
            
            <div className="relative h-12 w-12 flex-shrink-0">
               <Image 
                 src="/logoEngNet.png" 
                 alt="Logo EngNet" 
                 fill
                 className="object-contain"
                 priority
               />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Eng<span className="text-orange-500">Net</span>
            </h1>
          </div>
          
          <p className="mt-2 text-sm text-gray-400">
            Entre com suas credenciais para acessar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {erro && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <span>{erro}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-white placeholder:text-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm transition-colors"
                  placeholder="Digite seu e-mail"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-sm font-medium text-gray-300">
                  Senha
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full rounded-md border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-10 text-white placeholder:text-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm transition-colors"
                  placeholder="Digite sua senha"
                />
                
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white"
                >
                  {mostrarSenha ? <Eye size={19} /> : <EyeOff size={19} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Empreendedorismo e Liderança • EngNet Consultoria
          </p>
        </div>
      </div>
    </div>
  )
}