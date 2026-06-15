"use client";

import { useState, useEffect } from "react";
import { Heart, Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import { Institution } from "@prisma/client";
import { ConfirmModal } from "../../../../components/ConfirmModal";

export default function AdminInstituicoesPage() {
  const [ongs, setOngs] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOng, setEditingOng] = useState<Institution | null>(null);
  
  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ongToDelete, setOngToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    causa: "",
    descricao: "",
    sobre: "",
    website: "",
    telefone: "",
    cnpj: "",
    cep: "",
    endereco: "",
    chavePix: "",
    pixTitular: "",
    pixCidade: "",
    qrCodeImagem: "",
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOngs();
  }, []);

  const fetchOngs = async () => {
    try {
      const res = await fetch("/api/ongs");
      const data = await res.json();
      setOngs(data);
    } catch (error) {
      console.error("Erro ao buscar ONGs", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => {
    setOngToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!ongToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/ongs/${ongToDelete}`, { method: "DELETE" });
      fetchOngs();
    } catch (error) {
      alert("Erro ao deletar");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setOngToDelete(null);
    }
  };

  const openModal = (ong?: Institution) => {
    if (ong) {
      setEditingOng(ong);
      setFormData({
        nome: ong.nome,
        causa: ong.causa,
        descricao: ong.descricao,
        sobre: ong.sobre || "",
        website: ong.website || "",
        telefone: Array.isArray(ong.telefone) ? ong.telefone.join(", ") : (ong.telefone || ""),
        cnpj: ong.cnpj || "",
        cep: ong.cep || "",
        endereco: ong.endereco || "",
        chavePix: ong.chavePix || "",
        pixTitular: ong.pixTitular || "",
        pixCidade: ong.pixCidade || "",
        qrCodeImagem: ong.qrCodeImagem || "",
        ativo: ong.ativo,
      });
    } else {
      setEditingOng(null);
      setFormData({
        nome: "",
        causa: "",
        descricao: "",
        sobre: "",
        website: "",
        telefone: "",
        cnpj: "",
        cep: "",
        endereco: "",
        chavePix: "",
        pixTitular: "",
        pixCidade: "",
        qrCodeImagem: "",
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOng(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingOng ? `/api/ongs/${editingOng.id}` : "/api/ongs";
      const method = editingOng ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        telefone: formData.telefone ? formData.telefone.split(",").map(t => t.trim()).filter(Boolean) : [],
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchOngs();
      } else {
        alert("Erro ao salvar instituição.");
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
            <Heart className="w-8 h-8 text-primary" /> Instituições
          </h1>
          <p className="text-taupe mt-2">Gerencie as ONGs disponíveis para doação.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium tracking-wide flex items-center gap-2 hover:bg-primary/90 transition-all shadow-soft shrink-0"
        >
          <Plus className="w-5 h-5" /> Nova Instituição
        </button>
      </div>

      <div className="bg-card/50 border border-border/70 rounded-3xl overflow-hidden backdrop-blur shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-muted/50 border-b border-border/70 text-ui-text">
              <tr>
                <th className="p-5 font-medium">Nome / Causa</th>
                <th className="p-5 font-medium">Chave PIX</th>
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
              ) : ongs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-taupe">
                    Nenhuma instituição cadastrada.
                  </td>
                </tr>
              ) : (
                ongs.map((ong) => (
                  <tr key={ong.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-ui-text truncate max-w-[200px] md:max-w-xs">{ong.nome}</div>
                      <div className="text-sm text-taupe truncate max-w-[200px] md:max-w-xs">{ong.causa}</div>
                    </td>
                    <td className="p-5 text-sm text-taupe">
                      {ong.chavePix ? (
                        <span className="font-mono bg-muted/50 px-2 py-1 rounded">{ong.chavePix}</span>
                      ) : (
                        <span className="italic opacity-50">Não cadastrada</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        ong.ativo ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {ong.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(ong)}
                          className="p-2 text-taupe hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => requestDelete(ong.id)}
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
          <div className="bg-card border border-border/70 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-border/70 shrink-0">
              <h2 className="text-xl font-serif text-ui-text">
                {editingOng ? "Editar Instituição" : "Nova Instituição"}
              </h2>
              <button onClick={closeModal} className="p-2 text-taupe hover:bg-muted/50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="ong-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Nome da Instituição *</label>
                    <input 
                      required
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: Lar da Esperança"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">Causa Resumida *</label>
                    <input 
                      required
                      value={formData.causa}
                      onChange={e => setFormData({...formData, causa: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: Apoio à Criança com Câncer"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Chave PIX (Para receber doações da comissão)</label>
                    <input 
                      value={formData.chavePix}
                      onChange={e => setFormData({...formData, chavePix: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                      placeholder="Ex: 00.000.000/0000-00 ou email@ong.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">Titular do PIX (Nome que aparece no banco)</label>
                    <input 
                      value={formData.pixTitular}
                      onChange={e => setFormData({...formData, pixTitular: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: Lar da Esperanca"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">Cidade do PIX</label>
                    <input 
                      value={formData.pixCidade}
                      onChange={e => setFormData({...formData, pixCidade: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: UBERABA"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Caminho da Imagem do QR Code PIX (Opcional - Se preenchido, não gera dinamicamente)</label>
                    <input 
                      value={formData.qrCodeImagem}
                      onChange={e => setFormData({...formData, qrCodeImagem: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: /media/instituicoes/qr_lar.png"
                    />
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Descrição Curta *</label>
                    <textarea 
                      required
                      value={formData.descricao}
                      onChange={e => setFormData({...formData, descricao: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                      placeholder="Aparece no card de seleção do totem."
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Site / URL Principal (Usado para o QR Code)</label>
                    <input 
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: https://www.lardaesperanca.org.br"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">Telefone(s)</label>
                    <input 
                      value={formData.telefone}
                      onChange={e => setFormData({...formData, telefone: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Separados por vírgula. Ex: (11) 9999-9999"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">CNPJ</label>
                    <input 
                      value={formData.cnpj}
                      onChange={e => setFormData({...formData, cnpj: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">CEP</label>
                    <input 
                      value={formData.cep}
                      onChange={e => setFormData({...formData, cep: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ui-text">Endereço Completo</label>
                    <input 
                      value={formData.endereco}
                      onChange={e => setFormData({...formData, endereco: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Rua, Número, Bairro, Cidade"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-ui-text">Sobre (Opcional - Texto Longo)</label>
                    <textarea 
                      value={formData.sobre}
                      onChange={e => setFormData({...formData, sobre: e.target.value})}
                      className="w-full bg-background border border-border/70 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32"
                      placeholder="Texto longo sobre a história da ONG para o botão 'Saiba Mais'."
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-2 md:col-span-2">
                    <input 
                      type="checkbox"
                      id="ativo-checkbox"
                      checked={formData.ativo}
                      onChange={e => setFormData({...formData, ativo: e.target.checked})}
                      className="w-5 h-5 rounded border-border/70 text-primary focus:ring-primary"
                    />
                    <label htmlFor="ativo-checkbox" className="text-sm font-medium text-ui-text cursor-pointer">
                      Instituição Ativa (Aparece no Totem)
                    </label>
                  </div>
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
                form="ong-form"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-medium shadow-soft hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Instituição"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir Instituição"
        description="Tem certeza que deseja deletar esta instituição? Essa ação não pode ser desfeita."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setOngToDelete(null);
        }}
      />

    </div>
  );
}

