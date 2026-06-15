"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Heart, Flower2, ScrollText, LogOut, Settings, MessageSquareQuote, Users, FileSpreadsheet } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Para simplificar o logout sem uma API específica, a gente pode 
    // apagar o cookie "admin_token" via javascript definindo a validade no passado
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Catálogo", href: "/admin/catalogo", icon: Flower2 },
    { name: "Instituições", href: "/admin/instituicoes", icon: Heart },
    { name: "Pedidos", href: "/admin/pedidos", icon: ScrollText },
    { name: "Relatórios", href: "/admin/relatorios", icon: FileSpreadsheet },
    { name: "Frases / Faixas", href: "/admin/frases", icon: MessageSquareQuote },
    { name: "Óbitos", href: "/admin/obitos", icon: Users },
    { name: "Doadores", href: "/admin/doadores", icon: Users },
  ];

  return (
    <div 
      className="admin-theme min-h-screen bg-background flex flex-col landscape:flex-row pb-20 landscape:pb-0"
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
      {/* Sidebar / Bottom Bar */}
      <aside className="
        fixed z-50 bg-card/95 backdrop-blur shadow-soft border-border/70 flex
        /* Portrait: Barra Inferior */
        portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:w-full portrait:h-20 portrait:flex-row portrait:border-t portrait:items-center portrait:justify-around portrait:px-2
        /* Landscape: Menu Lateral */
        landscape:top-0 landscape:left-0 landscape:h-screen landscape:w-64 landscape:flex-col landscape:border-r landscape:shrink-0
      ">
        {/* Logo / Título - Visível apenas em Landscape */}
        <div className="hidden landscape:flex p-6 border-b border-border/70">
          <h2 className="font-serif text-xl text-ui-text flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </span>
            Painel Admin
          </h2>
        </div>
        
        {/* Links de Navegação */}
        <nav className="
          flex flex-1 overflow-y-auto
          /* Portrait */
          portrait:flex-row portrait:items-center portrait:justify-around portrait:w-full portrait:py-2
          /* Landscape */
          landscape:flex-col landscape:p-4 landscape:space-y-2
        ">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-soft" 
                    : "text-taupe hover:bg-muted/50 hover:text-ui-text"
                }
                  /* Portrait */
                  portrait:flex-col portrait:justify-center portrait:gap-1 portrait:px-3 portrait:py-2 portrait:rounded-2xl portrait:min-w-[4.5rem]
                  /* Landscape */
                  landscape:gap-3 landscape:px-4 landscape:py-3 landscape:rounded-xl
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`} />
                <span className="text-[10px] landscape:text-base font-medium leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Botão de Sair (Portrait) */}
          <button
            onClick={handleLogout}
            className="flex landscape:hidden flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl min-w-[4.5rem] text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Sair</span>
          </button>
        </nav>

        {/* Botão de Sair (Landscape) */}
        <div className="hidden landscape:block p-4 border-t border-border/70 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto landscape:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
