"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Loader2, X } from "lucide-react";
import { Obito } from "@prisma/client";
import { ConfirmModal } from "../../../../components/ConfirmModal";

export default function AdminObitosPage() {
  const [obitos, setObitos] = useState<Obito[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObito, setEditingObito] = useState<Obito | null>(null);
  
  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [obitoToDelete, setObitoToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    localVelorio: "",
    dataFalecimento: "",
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchObitos();
  }, []);

  const fetchObitos = async () => {
    try {
      const res = await fetch("/api/obitos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setObitos(data);
      } else {
        setObitos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar obitos", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => {
    setObitoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!obitoToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/obitos/${obitoToDelete}`, { method: "DELETE" });
      fetchObitos();
    } catch (error) {
      alert("Erro ao deletar");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setObitoToDelete(null);
    }
  };

  const openModal = (obito?: Obito) => {
    if (obito) {
      setEditingObito(obito);
      setFormData({
        nome: obito.nome,
        localVelorio: obito.localVelorio || "",
        dataFalecimento: obito.dataFalecimento ? new Date(obito.dataFalecimento).toISOString().split('T')[0] : "",
        ativo: obito.ativo,
      });
    } else {
      setEditingObito(null);
      setFormData({
        nome: "",
        localVelorio: "",
        dataFalecimento: new Date().toISOString().split('T')[0],
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingObito(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingObito ? `/api/obitos/${editingObito.id}` : "/api/obitos";
      const method = editingObito ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        dataFalecimento: formData.dataFalecimento ? new Date(formData.dataFalecimento).toISOString() : null
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchObitos();
      } else {
        alert("Erro ao salvar óbito.");
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
            <Users className="w-8 h-8 text-primary" /> Óbitos / Homenageados
          </h1>
          <p className="text-taupe mt-2">Gerencie os falecidos disponíveis para escolha no Totem.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium tracking-wide flex items-center gap-2 hover:bg-primary/90 transition-all shadow-soft shrink-0"
        >
          <Plus className="w-5 h-5" /> Novo Óbito
        </button>
      </div>

      <div className="bg-card/50 border border-border/70 rounded-3xl overflow-hidden backdrop-blur shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-muted/50 border-b border-border/70 text-ui-text">
              <tr>
                <th className="p-5 font-medium">Nome do Falecido</th>
                <th className="p-5 font-medium">Local (Velório)</th>
                <th className="p-5 font-medium">Data do Óbito</th>
                <th className="p-5 font-medium">Status no Totem</th>
                <th className="p-5 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-taupe">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : obitos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-taupe">
                    Nenhum óbito cadastrado.
                  </td>
                </tr>
              ) : (
                obitos.map((obito) => (
                  <tr key={obito.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-ui-text">{obito.nome}</div>
                    </td>
                    <td className="p-5 text-taupe">
                      {obito.localVelorio || "Não informado"}
                    </td>
                    <td className="p-5 text-taupe">
                      {obito.dataFalecimento ? new Date(obito.dataFalecimento).toLocaleDateString() : "Não informada"}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        obito.ativo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {obito.ativo ? "Ativo (Aparece no Totem)" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(obito)}
                          className="p-2 text-taupe hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => requestDelete(obito.id)}
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
                {editingObito ? "Editar Óbito" : "Novo Óbito"}
              </h2>
              <button onClick={closeModal} className="p-2 text-taupe hover:bg-muted/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="obito-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ui-text">Nome do Falecido *</label>
                  <input 
                    required
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                    className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: João da Silva"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ui-text">Local / Sala do Velório (Opcional)</label>
                  <input 
                    value={formData.localVelorio}
                    onChange={e => setFormData({...formData, localVelorio: e.target.value})}
                    className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: Sala 2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ui-text">Data de Falecimento (Opcional)</label>
                  <input 
                    type="date"
                    value={formData.dataFalecimento}
                    onChange={e => setFormData({...formData, dataFalecimento: e.target.value})}
                    className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
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
                    Velório Ativo (Aparece como opção de homenagem no Totem)
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
                form="obito-form"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium shadow-soft hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Óbito"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir Óbito"
        description="Tem certeza que deseja deletar este óbito? Esta ação o removerá das opções no Totem."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setObitoToDelete(null);
        }}
      />

    </div>
  );
}
