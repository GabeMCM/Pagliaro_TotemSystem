"use client";

import { useState, useEffect } from "react";
import { ScrollText, Loader2, User, Phone, MapPin, Calendar, CheckCircle, ChevronDown, ChevronUp, UserX, Clock, Building } from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";
import { Order, CatalogItem, Institution, Obito } from "@prisma/client";

type PedidoComRelacoes = Order & {
  catalogItem: CatalogItem | null;
  institution: Institution | null;
  obito: Obito | null;
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoComRelacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ativos" | "historico">("ativos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await fetch("/api/pedidos", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPedidos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, novoStatus: string) => {
    try {
      // Otimisticamente atualiza a UI
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));
      
      const res = await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
      });
      
      if (!res.ok) {
        throw new Error("Falha ao atualizar");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      // Reverte em caso de erro (re-fetch)
      fetchPedidos();
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (activeTab === "ativos") {
      return p.status === "PENDENTE" || p.status === "PAGO";
    } else {
      return p.status === "FINALIZADO" || p.status === "CANCELADO";
    }
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ui-text flex items-center gap-3">
            <ScrollText className="w-8 h-8 text-primary" /> Fila de Pedidos
          </h1>
          <p className="text-taupe mt-2">Gerencie as homenagens pendentes de confecção/entrega.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/30 p-1 rounded-xl w-full md:w-80 mb-6 border border-border/50">
        <button
          onClick={() => setActiveTab("ativos")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "ativos" 
              ? "bg-card text-primary shadow-sm border border-border/50" 
              : "text-taupe hover:text-ui-text"
          }`}
        >
          Fila Ativa
        </button>
        <button
          onClick={() => setActiveTab("historico")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "historico" 
              ? "bg-card text-primary shadow-sm border border-border/50" 
              : "text-taupe hover:text-ui-text"
          }`}
        >
          Histórico
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20 bg-card/50 border border-border/70 rounded-3xl backdrop-blur shadow-soft">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="py-20 text-center bg-card/50 border border-border/70 rounded-3xl backdrop-blur shadow-soft">
            <CheckCircle className="w-12 h-12 text-sage mx-auto mb-4 opacity-50" />
            <p className="text-taupe text-lg">
              {activeTab === "ativos" ? "Sua fila está limpa! Nenhum pedido pendente." : "Nenhum histórico encontrado."}
            </p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const isExpanded = expandedId === pedido.id;
            
            return (
              <div key={pedido.id} className="bg-card/95 border border-border/70 rounded-2xl shadow-sm hover:border-primary/30 transition-all overflow-hidden">
                
                {/* Header Resumido (Sempre Visível) */}
                <div 
                  className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(pedido.id)}
                >
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        pedido.status === "PAGO" ? "bg-green-100 text-green-700" : 
                        pedido.status === "PENDENTE" ? "bg-amber-100 text-amber-700" : 
                        pedido.status === "FINALIZADO" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {pedido.status}
                      </span>
                      <span className="text-xs text-taupe flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(pedido.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(pedido.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-ui-text truncate">
                      {pedido.catalogItem?.nome || "Item Removido"} {pedido.modeloNome && <span className="font-normal text-taupe ml-1">({pedido.modeloNome})</span>}
                    </h3>
                    
                    <p className="text-sm text-ui-text-muted mt-1 truncate">
                      <span className="font-medium text-ui-text">Para:</span> {pedido.obito?.nome || "Não informado"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/50 pt-3 md:pt-0 mt-2 md:mt-0">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(pedido.valorPago)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Botão de Finalizar (Apenas na Fila Ativa) */}
                      {activeTab === "ativos" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(pedido.id, "FINALIZADO");
                          }}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden md:inline">Entregue</span>
                        </button>
                      )}
                      
                      <button className="p-2 text-taupe hover:text-primary transition-colors bg-muted/50 rounded-lg">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detalhes (Expandido) */}
                {isExpanded && (
                  <div className="p-4 md:p-5 border-t border-border/50 bg-muted/10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-gentle-fade">
                    
                    {/* Coluna Esquerda: Frase e Óbito */}
                    <div className="space-y-5">
                      {pedido.frase && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-taupe mb-2">Mensagem a ser impressa na Faixa</h4>
                          <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                            <p className="text-ui-text font-semibold text-lg italic leading-snug">
                              "{pedido.frase}"
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-taupe mb-2">Detalhes do Velório</h4>
                        <div className="flex items-start gap-3 text-sm text-ui-text">
                          <MapPin className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{pedido.obito?.localVelorio || "Local não informado"}</p>
                            <p className="text-taupe mt-0.5">Óbito: {pedido.obito?.nome || "Não informado"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coluna Direita: Contato e Instituição */}
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-taupe mb-2 flex items-center gap-2">
                          Comprador
                          {pedido.anonimo && (
                            <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px]">
                              <UserX className="w-3 h-3" /> Anônimo p/ ONG
                            </span>
                          )}
                        </h4>
                        <div className="flex items-start gap-3 text-sm text-ui-text">
                          <User className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{pedido.nomeCliente || "Nome não informado"}</p>
                            {pedido.telefoneCliente && (
                              <p className="text-taupe mt-0.5 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {pedido.telefoneCliente}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-taupe mb-2">Doação Destinada a</h4>
                        <div className="flex items-start gap-3 text-sm text-ui-text">
                          <Building className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{pedido.institution?.nome || "Removida"}</p>
                          </div>
                        </div>
                      </div>
                      
                      {activeTab === "historico" && pedido.status !== "CANCELADO" && (
                        <div className="pt-2">
                           <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(pedido.id, "PAGO");
                            }}
                            className="text-xs text-taupe underline hover:text-primary"
                          >
                            Desfazer finalização (Voltar p/ Fila)
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
