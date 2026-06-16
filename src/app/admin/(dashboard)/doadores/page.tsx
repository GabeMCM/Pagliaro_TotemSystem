"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Search, Calendar, Phone } from "lucide-react";

export default function AdminDoadoresPage() {
  const [doadores, setDoadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoadores();
  }, []);

  const fetchDoadores = async () => {
    try {
      const res = await fetch("/api/doadores", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoadores(data);
      }
    } catch (error) {
      console.error("Erro ao buscar doadores", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoadores = doadores.filter(d => 
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    d.telefone.includes(search)
  );

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ui-text flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Banco de Doadores
          </h1>
          <p className="text-taupe mt-2">CRM permanente de clientes que já realizaram homenagens.</p>
        </div>
      </div>

      <div className="mb-6 relative w-full md:max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
        <input 
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border/70 rounded-xl text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20 bg-card/50 border border-border/70 rounded-3xl backdrop-blur shadow-soft">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredDoadores.length === 0 ? (
          <div className="py-20 text-center bg-card/50 border border-border/70 rounded-3xl backdrop-blur shadow-soft">
            <Users className="w-12 h-12 text-taupe mx-auto mb-4 opacity-30" />
            <p className="text-taupe text-lg">
              Nenhum doador encontrado.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-border/70 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/50 text-sm uppercase tracking-wider text-taupe">
                    <th className="p-4 font-medium">Nome do Doador</th>
                    <th className="p-4 font-medium">WhatsApp / Telefone</th>
                    <th className="p-4 font-medium">Cliente Desde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredDoadores.map((doador) => (
                    <tr key={doador.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-ui-text font-medium">{doador.nome}</td>
                      <td className="p-4 text-taupe flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {doador.telefone}
                      </td>
                      <td className="p-4 text-taupe text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(doador.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
