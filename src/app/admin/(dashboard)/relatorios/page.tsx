"use client";

import { useState, useEffect } from "react";
import { FileSpreadsheet, Loader2, Printer, UserX, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";
import { ConfirmModal } from "../../../../components/ConfirmModal";

export default function AdminRelatoriosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPrinted, setHasPrinted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

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

  const handlePrint = () => {
    window.print();
    setTimeout(() => {
      setHasPrinted(true);
    }, 1000);
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      const res = await fetch("/api/pedidos/cleanup", {
        method: "DELETE",
      });
      if (res.ok) {
        setShowConfirmModal(false);
        setHasPrinted(false);
        await fetchPedidos();
        alert("Todos os registros finalizados foram apagados com sucesso!");
      } else {
        alert("Falha ao apagar registros.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com servidor.");
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="p-6 md:p-10 relative">
      {/* Esconder no momento da impressão */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ui-text flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary" /> Relatórios / Prestação de Contas
          </h1>
          <p className="text-taupe mt-2">Visão tabular de todas as vendas e doações para repasse às Instituições.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handlePrint}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-soft shrink-0"
          >
            <Printer className="w-5 h-5" /> Imprimir / PDF
          </button>
          
          <button 
            onClick={() => setShowConfirmModal(true)}
            disabled={!hasPrinted}
            className={`px-6 py-3 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-soft shrink-0 ${
              hasPrinted 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title={!hasPrinted ? "Você precisa Imprimir/Gerar o PDF primeiro." : "Apagar pedidos finalizados"}
          >
            <Trash2 className="w-5 h-5" /> Fechar Ciclo
          </button>
        </div>
      </div>

      {/* Modal de Confirmação Genérico */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Limpeza de Banco"
        description="Você está prestes a apagar permanentemente todos os pedidos marcados como FINALIZADOS. Eles serão removidos do histórico para liberar espaço."
        warningText="Certifique-se de que o PDF gerado foi salvo. Para continuar, digite"
        confirmKeyword="CONFIRMAR"
        isProcessing={isCleaning}
        onConfirm={handleCleanup}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Cabeçalho visível APENAS na impressão */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase mb-2">Relatório de Repasse - Culto da Saudade</h1>
        <p className="text-sm">Data de emissão: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-card/50 border border-border/70 rounded-3xl overflow-hidden backdrop-blur shadow-soft print:shadow-none print:border-black print:rounded-none">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : pedidos.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-taupe text-lg">Nenhum registro encontrado.</p>
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap md:whitespace-normal print:text-xs">
              <thead className="bg-muted/50 border-b border-border/70 text-ui-text print:bg-transparent print:border-black">
                <tr>
                  <th className="p-4 font-medium print:p-2">Data</th>
                  <th className="p-4 font-medium print:p-2">Comprador</th>
                  <th className="p-4 font-medium print:p-2">Homenageado (Óbito)</th>
                  <th className="p-4 font-medium print:p-2">Instituição (ONG)</th>
                  <th className="p-4 font-medium print:p-2">Valor</th>
                  <th className="p-4 font-medium print:p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 print:divide-black/20">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-muted/20 transition-colors print:border-b">
                    <td className="p-4 print:p-2 text-sm text-taupe print:text-black">
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="p-4 print:p-2">
                      <div className="flex items-center gap-2">
                        {pedido.anonimo ? (
                          <div className="flex items-center gap-1.5" title="Anônimo para a ONG">
                            <span className="font-medium text-ui-text print:text-black">
                              {pedido.nomeCliente || "Não informado"}
                            </span>
                            <span className="bg-red-100 text-red-700 p-1 rounded-full print:border print:border-red-500">
                              <UserX className="w-3 h-3" />
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-ui-text print:text-black">
                              {pedido.nomeCliente || "Não informado"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-taupe print:text-gray-600">
                        {pedido.telefoneCliente}
                      </div>
                    </td>

                    <td className="p-4 print:p-2 text-sm text-ui-text print:text-black">
                      {pedido.obito?.nome || "Não informado"}
                    </td>

                    <td className="p-4 print:p-2 text-sm">
                      <span className="font-medium text-primary/90 print:text-black">
                        {pedido.institution?.nome || "Removida"}
                      </span>
                    </td>

                    <td className="p-4 print:p-2 font-mono font-medium text-ui-text print:text-black">
                      {formatCurrency(pedido.valorPago)}
                    </td>

                    <td className="p-4 print:p-2 text-center">
                      <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider print:border ${
                        pedido.status === "PAGO" ? "bg-green-100 text-green-700 print:text-black" : 
                        pedido.status === "PENDENTE" ? "bg-amber-100 text-amber-700 print:text-black" : 
                        pedido.status === "FINALIZADO" ? "bg-blue-100 text-blue-700 print:text-black" :
                        "bg-red-100 text-red-700 print:text-black"
                      }`}>
                        {pedido.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
