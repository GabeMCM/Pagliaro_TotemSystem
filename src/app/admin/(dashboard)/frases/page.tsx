"use client";

import { useState, useEffect } from "react";
import { MessageSquareQuote, Plus, Edit2, Trash2, Loader2, X } from "lucide-react";
import { MessageTemplate } from "@prisma/client";
import { ConfirmModal } from "../../../../components/ConfirmModal";

export default function AdminFrasesPage() {
  const [frases, setFrases] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFrase, setEditingFrase] = useState<MessageTemplate | null>(null);
  
  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fraseToDelete, setFraseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    texto: "",
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFrases();
  }, []);

  const fetchFrases = async () => {
    try {
      const res = await fetch("/api/frases");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFrases(data);
      } else {
        console.error("Retorno inesperado da API:", data);
        setFrases([]);
      }
    } catch (error) {
      console.error("Erro ao buscar frases", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => {
    setFraseToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!fraseToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/frases/${fraseToDelete}`, { method: "DELETE" });
      fetchFrases();
    } catch (error) {
      alert("Erro ao deletar");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setFraseToDelete(null);
    }
  };

  const openModal = (frase?: MessageTemplate) => {
    if (frase) {
      setEditingFrase(frase);
      setFormData({
        texto: frase.texto,
        ativo: frase.ativo,
      });
    } else {
      setEditingFrase(null);
      setFormData({
        texto: "",
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFrase(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.texto.length > 100) {
      alert("A frase não pode exceder 100 caracteres para garantir legibilidade.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = editingFrase ? `/api/frases/${editingFrase.id}` : "/api/frases";
      const method = editingFrase ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        fetchFrases();
      } else {
        alert("Erro ao salvar frase.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ui-text flex items-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-primary" /> Frases Prontas
          </h1>
          <p className="text-taupe mt-2">Gerencie as opções de mensagens (Dedicatórias) que aparecem para escolha na Faixa de Coroa.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium tracking-wide flex items-center gap-2 hover:bg-primary/90 transition-all shadow-soft shrink-0"
        >
          <Plus className="w-5 h-5" /> Nova Frase
        </button>
      </div>

      <div className="bg-card/50 border border-border/70 rounded-3xl overflow-hidden backdrop-blur shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-muted/50 border-b border-border/70 text-ui-text">
              <tr>
                <th className="p-5 font-medium">Frase / Mensagem</th>
                <th className="p-5 font-medium w-32 text-center">Caracteres</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-taupe">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : frases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-taupe">
                    Nenhuma frase cadastrada. Cadastre as opções padrões.
                  </td>
                </tr>
              ) : (
                frases.map((frase) => (
                  <tr key={frase.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-ui-text">"{frase.texto}"</div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`text-sm ${frase.texto.length > 80 ? 'text-orange-500' : 'text-taupe'}`}>
                        {frase.texto.length}/100
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        frase.ativo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {frase.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(frase)}
                          className="p-2 text-taupe hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => requestDelete(frase.id)}
                          className="p-2 text-taupe hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal de Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border/70 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-border/70 shrink-0">
              <h2 className="text-xl font-serif text-ui-text">
                {editingFrase ? "Editar Frase" : "Nova Frase"}
              </h2>
              <button onClick={closeModal} className="p-2 text-taupe hover:bg-muted/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="frase-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-ui-text">Texto da Mensagem *</label>
                    <span className={`text-xs ${formData.texto.length > 100 ? 'text-red-500 font-bold' : 'text-taupe'}`}>
                      {formData.texto.length}/100
                    </span>
                  </div>
                  <textarea 
                    required
                    maxLength={100}
                    value={formData.texto}
                    onChange={e => setFormData({...formData, texto: e.target.value})}
                    className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                    placeholder="Ex: Saudades eternas de seus familiares."
                  />
                  <p className="text-xs text-taupe">Mensagens curtas (até 100 caracteres) garantem a legibilidade da faixa durante o velório.</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input 
                    type="checkbox"
                    id="ativo-checkbox"
                    checked={formData.ativo}
                    onChange={e => setFormData({...formData, ativo: e.target.checked})}
                    className="w-5 h-5 rounded border-border/70 text-primary focus:ring-primary"
                  />
                  <label htmlFor="ativo-checkbox" className="text-sm font-medium text-ui-text cursor-pointer">
                    Ativa (Aparece como opção no Totem)
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border/70 bg-muted/30 shrink-0 flex justify-end gap-3 rounded-b-3xl">
              <button 
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-full font-medium text-taupe hover:text-ui-text hover:bg-muted/50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="frase-form"
                disabled={isSubmitting || formData.texto.length > 100}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium shadow-soft hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Frase"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir Frase"
        description="Tem certeza que deseja deletar esta frase? Essa ação não pode ser desfeita."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setFraseToDelete(null);
        }}
      />

    </div>
  );
}
