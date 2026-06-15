"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, AlertCircle } from "lucide-react";
import { STRINGS } from "../../../data/strings";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redireciona para o dashboard
        router.push("/admin");
        router.refresh(); // Força o middleware a rodar
      } else {
        setError(data.message || "Senha incorreta");
      }
    } catch (err) {
      setError("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="admin-theme min-h-screen bg-background flex flex-col items-center justify-center p-4"
      style={{
        '--background': '#f8fafc',
        '--primary': '#3b82f6',
        '--primary-foreground': '#ffffff',
        '--secondary': '#e2e8f0',
        '--accent': '#dbeafe',
        '--sage': '#94a3b8',
        '--rose': '#f43f5e',
        '--taupe': '#64748b',
        '--ui-text': '#0f172a',
        '--ui-text-muted': '#475569',
        '--card': '#ffffff',
        '--border': '#e2e8f0',
        '--muted': '#f1f5f9'
      } as React.CSSProperties}
    >
      <div className="w-full max-w-md bg-card/80 backdrop-blur border border-border/70 p-8 md:p-10 rounded-3xl shadow-soft animate-rise">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-float-slow">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-ui-text text-center mb-2">
          Acesso Restrito
        </h1>
        <p className="text-taupe text-center mb-8">
          Painel de Administração Totem Saudade
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-ui-text ml-1">
              Senha Mestre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-border/70 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-ui-text"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Entrar no Painel <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push("/")}
            className="text-taupe hover:text-primary transition-colors text-sm underline-offset-4 hover:underline"
          >
            Voltar para o Totem
          </button>
        </div>
      </div>
    </div>
  );
}
