"use client";

import { useState, useEffect } from "react";
import { Flower2, Loader2, Power, Settings } from "lucide-react";
import { CatalogItem } from "@prisma/client";
import { formatCurrency } from "../../../../lib/utils";
import Link from "next/link";

export default function AdminCatalogoPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/catalogo");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar catálogo", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (item: CatalogItem) => {
    // Atualização Otimista
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, ativo: !i.ativo } : i));
    
    try {
      const res = await fetch(`/api/catalogo/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Enviamos apenas o ativo alterado, mantendo os outros dados iguais (ou a API de PUT deve suportar patch parcial)
        // Se a API exigir todos os campos (como estava no formulário anterior), precisamos enviar tudo:
        body: JSON.stringify({
          nome: item.nome,
          descricao: item.descricao,
          faixa: item.faixa,
          valor: item.valor,
          imagem: item.imagem,
          caminhoUrl: item.caminhoUrl || "",
          requerFotos: item.requerFotos,
          ativo: !item.ativo,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha");
      }
    } catch (error) {
      alert("Erro ao alterar status.");
      fetchItems(); // Reverte
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ui-text flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-primary" /> Catálogo
          </h1>
          <p className="text-taupe mt-2">Ative ou desative as homenagens que aparecerão no Totem.</p>
        </div>
      </div>

      <div className="bg-card/50 border border-border/70 rounded-3xl overflow-hidden backdrop-blur shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-muted/50 border-b border-border/70 text-ui-text">
              <tr>
                <th className="p-5 font-medium w-16">Img</th>
                <th className="p-5 font-medium">Nome / Descrição</th>
                <th className="p-5 font-medium">Valor</th>
                <th className="p-5 font-medium text-center">Status no Totem</th>
                <th className="p-5 font-medium text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-taupe">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-taupe">
                    Nenhuma homenagem cadastrada.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={`transition-colors ${!item.ativo ? "bg-muted/30 opacity-75" : "hover:bg-muted/10"}`}>
                    <td className="p-5">
                      <div className={`w-12 h-12 rounded-xl overflow-hidden bg-muted/50 border border-border/50 ${!item.ativo ? 'grayscale' : ''}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-medium text-ui-text truncate max-w-[200px] md:max-w-xs">{item.nome}</div>
                      <div className="text-sm text-taupe truncate max-w-[200px] md:max-w-xs">{item.descricao}</div>
                    </td>
                    <td className="p-5 text-ui-text font-medium">
                      {formatCurrency(item.valor)}
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold ${
                        item.ativo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {item.ativo ? "Disponível" : "Oculto"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/catalogo/${item.id}`}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 px-4"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">Configurar</span>
                        </Link>

                        <button 
                          onClick={() => toggleAtivo(item)}
                          className={`p-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 px-4 ${
                            item.ativo 
                              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                          }`}
                        >
                          <Power className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">{item.ativo ? "Desativar" : "Ativar"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
