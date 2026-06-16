"use client";

import { useState, useEffect } from "react";
import { MessageSquareQuote, Plus, Edit2, Trash2, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { SplashMessage } from "@prisma/client";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { CONFIG } from "../../../../data/config";
import { STRINGS } from "../../../../data/strings";
import toast from "react-hot-toast";

export default function AdminSplashMessagesPage() {
  const [messages, setMessages] = useState<SplashMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<SplashMessage | null>(null);
  
  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    texto: "",
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/splash-messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Retorno inesperado da API:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => {
    setMessageToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      toast.success(STRINGS.admin.feedback.sucessoExcluir);
      fetchMessages();
    } catch (error) {
      toast.error(STRINGS.admin.feedback.erroExcluir);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setMessageToDelete(null);
    }
  };

  const toggleAtivo = async (message: SplashMessage) => {
    try {
      await fetch(`/api/splash-messages/${message.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...message, ativo: !message.ativo }),
      });
      toast.success(STRINGS.admin.feedback.sucessoSalvar);
      fetchMessages();
    } catch (error) {
      toast.error(STRINGS.admin.feedback.erroSalvar);
    }
  };

  const openModal = (message?: SplashMessage) => {
    if (message) {
      setEditingMessage(message);
      setFormData({
        texto: message.texto,
        ativo: message.ativo,
      });
    } else {
      setEditingMessage(null);
      setFormData({
        texto: "",
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.texto.length > CONFIG.splashMessage.maxLength) {
      toast.error(`A frase não pode exceder ${CONFIG.splashMessage.maxLength} caracteres para garantir legibilidade.`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = editingMessage ? `/api/splash-messages/${editingMessage.id}` : "/api/splash-messages";
      const method = editingMessage ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(STRINGS.admin.feedback.sucessoSalvar);
        fetchMessages();
      } else {
        toast.error(STRINGS.admin.feedback.erroSalvar);
      }
    } catch (error) {
      toast.error(STRINGS.admin.feedback.erroConexao);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ui-text flex items-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-primary" /> Mensagens da Tela Inicial
          </h1>
          <p className="text-taupe mt-2">Gerencie as frases que ficam mudando automaticamente na tela de descanso do Totem.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium tracking-wide flex items-center gap-2 hover:bg-primary/90 transition-all shadow-soft shrink-0"
        >
          <Plus className="w-5 h-5" /> Nova Mensagem
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
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-taupe">
                    Nenhuma mensagem cadastrada. Cadastre as opções para a tela de descanso.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-ui-text">"{message.texto}"</div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`text-sm ${message.texto.length > (CONFIG.splashMessage.maxLength * 0.8) ? 'text-orange-500' : 'text-taupe'}`}>
                        {message.texto.length}/{CONFIG.splashMessage.maxLength}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        message.ativo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {message.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleAtivo(message)}
                          className={`p-2 rounded-lg transition-colors ${message.ativo ? 'text-green-600 hover:bg-green-50' : 'text-taupe hover:bg-muted'}`}
                          title={message.ativo ? "Desativar" : "Ativar"}
                        >
                          {message.ativo ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => openModal(message)}
                          className="p-2 text-taupe hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => requestDelete(message.id)}
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
              <h2 className="text-xl font-semibold text-ui-text">
                {editingMessage ? "Editar Mensagem" : "Nova Mensagem"}
              </h2>
              <button onClick={closeModal} className="p-2 text-taupe hover:bg-muted/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="message-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-ui-text">Texto da Mensagem *</label>
                    <span className={`text-xs ${formData.texto.length > CONFIG.splashMessage.maxLength ? 'text-red-500 font-bold' : 'text-taupe'}`}>
                      {formData.texto.length}/{CONFIG.splashMessage.maxLength}
                    </span>
                  </div>
                  <textarea 
                    required
                    maxLength={CONFIG.splashMessage.maxLength}
                    value={formData.texto}
                    onChange={e => setFormData({...formData, texto: e.target.value})}
                    className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                    placeholder="Ex: Homenagear também é preservar."
                  />
                  <p className="text-xs text-taupe">Aparecerá grande no meio da tela de descanso do Totem.</p>
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
                    Ativa (Aparecerá na rotação da tela inicial)
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
                form="message-form"
                disabled={isSubmitting || formData.texto.length > CONFIG.splashMessage.maxLength}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium shadow-soft hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Mensagem"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir Mensagem"
        description="Tem certeza que deseja deletar esta mensagem? Essa ação não pode ser desfeita."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setMessageToDelete(null);
        }}
      />

    </div>
  );
}
