"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Home, MessageSquareQuote, FileSpreadsheet, LayoutDashboard, Menu, X, Cross, BookOpen, Layers, UserCircle, ChevronDown, ChevronUp, Bell, HeartHandshake, Flower2, ScrollText, Users, Settings, Heart, UserMinus } from "lucide-react";
import { adminThemeStyles } from "../../../data/admin-theme";
import { Toaster } from 'react-hot-toast';

type NavItem = { name: string; href: string; icon: React.ElementType };

type NavCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("ATENDENTE");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setRole(data.user.role);
        }
      })
      .catch(console.error);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {}
    router.push("/admin/login");
  };

  const navCategories: NavCategory[] = [
    {
      id: "conteudo",
      label: "Conteúdo",
      icon: Flower2,
      items: [
        { name: "Catálogo", href: "/admin/catalogo", icon: Flower2 },
        { name: "Frases / Faixas", href: "/admin/frases", icon: MessageSquareQuote },
        { name: "Msg Iniciais", href: "/admin/mensagens-iniciais", icon: MessageSquareQuote },
      ]
    },
    {
      id: "doacoes",
      label: "Doações",
      icon: ScrollText,
      items: [
        { name: "Pedidos", href: "/admin/pedidos", icon: ScrollText },
        { name: "Instituições", href: "/admin/instituicoes", icon: Heart },
        { name: "Relatórios", href: "/admin/relatorios", icon: FileSpreadsheet },
      ]
    },
    {
      id: "pessoas",
      label: "Pessoas",
      icon: Users,
      items: [
        { name: "Óbitos", href: "/admin/obitos", icon: UserMinus },
        { name: "Doadores", href: "/admin/doadores", icon: Heart },
        ...(role === "GESTOR" ? [{ name: "Usuários", href: "/admin/usuarios", icon: Users }] : []),
      ]
    },
    {
      id: "sistema",
      label: "Sistema",
      icon: Settings,
      items: [
        { name: "Sair", href: "#", icon: LogOut },
      ]
    }
  ];

  const toggleMenu = (categoryId: string) => {
    setActiveMenu(prev => prev === categoryId ? null : categoryId);
  };

  const isRouteActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || (href !== "/admin" && pathname?.startsWith(href));
  };

  const isCategoryActive = (category: NavCategory) => {
    return category.items.some(item => isRouteActive(item.href));
  };

  return (
    <div 
      className="admin-theme min-h-screen bg-background flex flex-col landscape:flex-row pb-24 landscape:pb-0"
      style={adminThemeStyles}
    >
      <Toaster position="top-right" />
      {/* Sidebar / Bottom Bar */}
      <aside 
        ref={menuRef}
        className="
          fixed z-50 bg-card shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] border-border/70 flex
          /* Portrait: Barra Inferior */
          portrait:bottom-0 portrait:left-0 portrait:right-0 portrait:w-full portrait:h-20 portrait:flex-row portrait:border-t portrait:items-stretch portrait:justify-between portrait:px-2
          /* Landscape: Menu Lateral */
          landscape:top-0 landscape:left-0 landscape:h-screen landscape:w-64 landscape:flex-col landscape:border-r landscape:shrink-0
        "
      >
        {/* Logo / Título - Visível apenas em Landscape */}
        <div className="hidden landscape:flex p-6 border-b border-border/70">
          <h2 className="font-semibold text-xl text-ui-text flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </span>
            Painel Admin
          </h2>
        </div>
        
        {/* Links de Navegação */}
        <nav className="
          flex flex-1 
          /* Portrait */
          portrait:flex-row portrait:items-stretch portrait:justify-around portrait:w-full portrait:relative portrait:h-full
          /* Landscape */
          landscape:flex-col landscape:p-4 landscape:space-y-4 landscape:overflow-y-auto
        ">
          
          {/* Item 1: Conteúdo */}
          <NavCategoryGroup 
            category={navCategories[0]} 
            isActive={isCategoryActive(navCategories[0]) || activeMenu === navCategories[0].id}
            isOpen={activeMenu === navCategories[0].id}
            onToggle={() => toggleMenu(navCategories[0].id)}
            isRouteActive={isRouteActive}
            handleLogout={handleLogout}
            onItemClick={() => setActiveMenu(null)}
            align="left"
          />

          {/* Item 2: Doações */}
          <NavCategoryGroup 
            category={navCategories[1]} 
            isActive={isCategoryActive(navCategories[1]) || activeMenu === navCategories[1].id}
            isOpen={activeMenu === navCategories[1].id}
            onToggle={() => toggleMenu(navCategories[1].id)}
            isRouteActive={isRouteActive}
            handleLogout={handleLogout}
            onItemClick={() => setActiveMenu(null)}
          />

          {/* Botão Central: Dashboard */}
          <div className="relative flex flex-col items-center portrait:justify-end portrait:h-full portrait:pb-2 portrait:z-10 portrait:w-[4.5rem]">
            <Link 
              href="/admin"
              onClick={() => setActiveMenu(null)}
              className={`
                flex items-center justify-center rounded-full shadow-card transition-all duration-300 hover:scale-105
                portrait:w-14 portrait:h-14 portrait:border-4 portrait:border-card portrait:absolute portrait:bottom-7
                landscape:w-full landscape:h-12 landscape:rounded-xl landscape:justify-start landscape:px-4 landscape:gap-3 landscape:shadow-none landscape:border-none
                ${pathname === "/admin" ? "bg-primary text-primary-foreground shadow-primary/30" : "bg-card text-taupe portrait:text-ui-text landscape:border landscape:border-border/70 hover:text-primary"}
              `}
            >
              <LayoutDashboard className="portrait:w-6 portrait:h-6 landscape:w-5 landscape:h-5" />
              <span className="hidden landscape:block font-medium text-base">Dashboard</span>
            </Link>
            <span className={`portrait:block landscape:hidden text-[11px] leading-none font-medium mt-auto transition-colors ${pathname === "/admin" ? "text-primary" : "text-taupe"}`}>Geral</span>
          </div>

          {/* Item 3: Pessoas */}
          <NavCategoryGroup 
            category={navCategories[2]} 
            isActive={isCategoryActive(navCategories[2]) || activeMenu === navCategories[2].id}
            isOpen={activeMenu === navCategories[2].id}
            onToggle={() => toggleMenu(navCategories[2].id)}
            isRouteActive={isRouteActive}
            handleLogout={handleLogout}
            onItemClick={() => setActiveMenu(null)}
          />

          {/* Item 4: Sistema */}
          <NavCategoryGroup 
            category={navCategories[3]} 
            isActive={isCategoryActive(navCategories[3]) || activeMenu === navCategories[3].id}
            isOpen={activeMenu === navCategories[3].id}
            onToggle={() => toggleMenu(navCategories[3].id)}
            isRouteActive={isRouteActive}
            handleLogout={handleLogout}
            onItemClick={() => setActiveMenu(null)}
            align="right"
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto landscape:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

function NavCategoryGroup({ 
  category, 
  isActive, 
  isOpen, 
  onToggle, 
  isRouteActive,
  handleLogout,
  onItemClick,
  align = "center"
}: { 
  category: NavCategory; 
  isActive: boolean; 
  isOpen: boolean; 
  onToggle: () => void;
  isRouteActive: (href: string) => boolean;
  handleLogout: () => void;
  onItemClick: () => void;
  align?: "left" | "center" | "right";
}) {
  const isHighlighted = isActive || isOpen;

  const alignmentClasses = {
    left: "portrait:left-0",
    center: "portrait:left-1/2 portrait:-translate-x-1/2",
    right: "portrait:right-0"
  };

  return (
    <div className="relative flex flex-col landscape:w-full portrait:h-full portrait:justify-end portrait:pb-2">
      {/* Botão Categoria */}
      <button
        onClick={onToggle}
        className={`
          flex items-center transition-all duration-300
          /* Portrait */
          portrait:flex-col portrait:justify-end portrait:items-center portrait:gap-1 portrait:px-1 portrait:w-[4.5rem] portrait:h-full
          /* Landscape */
          landscape:gap-3 landscape:px-4 landscape:py-3 landscape:rounded-xl landscape:w-full landscape:justify-between
          ${isHighlighted ? "text-primary" : "text-taupe hover:text-ui-text landscape:hover:bg-muted/50"}
        `}
      >
        <div className="flex landscape:items-center landscape:gap-3 flex-col landscape:flex-row items-center portrait:mt-auto">
          <category.icon className={`w-6 h-6 landscape:w-5 landscape:h-5 transition-transform ${isHighlighted ? "scale-110" : ""}`} />
          <span className="text-[11px] landscape:text-[15px] leading-none mt-1.5 landscape:mt-0 font-medium">
            {category.label}
          </span>
        </div>
        <ChevronUp className={`hidden landscape:block w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu Drop-up / Drop-down */}
      <div 
        className={`
          absolute z-50 bg-card border border-border/70 overflow-hidden transition-all duration-200 ease-out origin-bottom landscape:origin-top
          /* Portrait: Menu flutuante */
          portrait:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.15)] portrait:bottom-full ${alignmentClasses[align]} portrait:mb-4 portrait:w-52 portrait:rounded-2xl
          /* Landscape: Acordeão abaixo do botão */
          landscape:static landscape:w-full landscape:border-none landscape:shadow-none landscape:rounded-none landscape:mt-1
          ${isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 portrait:translate-y-2 landscape:-translate-y-2 scale-95 pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-3 landscape:pl-10 landscape:py-0 landscape:space-y-1">
          {category.items.map((item) => {
            const isItemActive = isRouteActive(item.href);
            
            if (item.name === "Sair") {
              return (
                <button
                  key={item.name}
                  onClick={() => { onItemClick(); handleLogout(); }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold text-base w-full text-left"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold text-base
                  ${isItemActive 
                    ? "bg-primary text-primary-foreground shadow-soft" 
                    : "text-taupe hover:bg-muted/50 hover:text-ui-text"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isItemActive ? "text-primary-foreground" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
