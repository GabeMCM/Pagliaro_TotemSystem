"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Flower2, Loader2, ArrowLeft, Save, Plus, Trash2, Edit2, X } from "lucide-react";
import Link from "next/link";
import { CatalogItem, CatalogModel } from "@prisma/client";
import { ConfirmModal } from "../../../../../components/ConfirmModal";

interface CatalogItemWithModels extends CatalogItem {
  modelos: CatalogModel[];
}

export default function AdminCatalogoConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [item, setItem] = useState<CatalogItemWithModels | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados do Item Principal
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [faixa, setFaixa] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [imagem, setImagem] = useState("");
  const [ativo, setAtivo] = useState(true);

  // Estados dos Modelos
  const [modelos, setModelos] = useState<CatalogModel[]>([]);
  const [novoModeloNome, setNovoModeloNome] = useState("");
  const [novoModeloImagem, setNovoModeloImagem] = useState("");
  const [novoModeloValor, setNovoModeloValor] = useState<string>("");
  const [adicionandoModelo, setAdicionandoModelo] = useState(false);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [modeloToDelete, setModeloToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [resolvedParams.id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/catalogo/${resolvedParams.id}`);
      if (!res.ok) throw new Error("Falha ao buscar item");
      const data = await res.json();
      setItem(data);
      setNome(data.nome);
      setDescricao(data.descricao);
      setFaixa(data.faixa);
      setValor(data.valor);
      setImagem(data.imagem);
      setAtivo(data.ativo);
      setModelos(data.modelos || []);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar dados do item.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/catalogo/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          descricao,
          faixa,
          valor,
          imagem,
          ativo,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar item");
      alert("Item atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModel = async () => {
    if (!novoModeloImagem) {
      alert("A imagem (caminho) do modelo é obrigatória.");
      return;
    }
    setAdicionandoModelo(true);
    
    try {
      if (editingModelId) {
        // Editar existente
        const res = await fetch(`/api/modelos/${editingModelId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: novoModeloNome,
            imagem: novoModeloImagem,
            valor: novoModeloValor ? parseFloat(novoModeloValor) : null,
          }),
        });

        if (!res.ok) throw new Error("Erro ao editar modelo");
        const updatedModel = await res.json();
        setModelos(modelos.map(m => m.id === editingModelId ? updatedModel : m));
        setEditingModelId(null);
      } else {
        // Criar novo
        const res = await fetch("/api/modelos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            catalogItemId: resolvedParams.id,
            nome: novoModeloNome,
            imagem: novoModeloImagem,
            valor: novoModeloValor ? parseFloat(novoModeloValor) : null,
          }),
        });

        if (!res.ok) throw new Error("Erro ao adicionar modelo");
        const addedModel = await res.json();
        setModelos([...modelos, addedModel]);
      }
      
      // Limpar formulário e fechar modal
      setNovoModeloNome("");
      setNovoModeloImagem("");
      setNovoModeloValor("");
      setIsModalOpen(false);
      setEditingModelId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar modelo.");
    } finally {
      setAdicionandoModelo(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent, modelo: CatalogModel) => {
    e.preventDefault();
    setEditingModelId(modelo.id);
    setNovoModeloNome(modelo.nome || "");
    setNovoModeloImagem(modelo.imagem || "");
    setNovoModeloValor(modelo.valor ? modelo.valor.toString() : "");
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingModelId(null);
    setNovoModeloNome("");
    setNovoModeloImagem("");
    setNovoModeloValor("");
    setIsModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setEditingModelId(null);
    setNovoModeloNome("");
    setNovoModeloImagem("");
    setNovoModeloValor("");
    setIsModalOpen(true);
  };

  const requestDelete = (modeloId: string) => {
    setModeloToDelete(modeloId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!modeloToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/modelos/${modeloToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir modelo");
      setModelos(modelos.filter((m) => m.id !== modeloToDelete));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir modelo.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setModeloToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return <div className="p-10 text-red-500">Item não encontrado.</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
      <div className="mb-6">
        <Link href="/admin/catalogo" className="inline-flex items-center gap-2 text-taupe hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ui-text flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-primary" /> Configuração: {item.nome}
          </h1>
          <p className="text-taupe mt-2">Altere os detalhes principais e gerencie os modelos (fotos) desta homenagem.</p>
        </div>
      </div>

      {/* DADOS PRINCIPAIS */}
      <div className="bg-card/50 border border-border/70 p-6 md:p-8 rounded-3xl backdrop-blur shadow-soft mb-10">
        <h2 className="text-xl font-serif text-ui-text mb-6 border-b border-border/50 pb-4">Dados Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-taupe mb-2">Nome da Homenagem</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-taupe mb-2">Descrição</label>
            <textarea 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-taupe mb-2">Faixa de Preço (Exibição)</label>
            <input 
              type="text" 
              value={faixa}
              onChange={(e) => setFaixa(e.target.value)}
              placeholder="Ex: R$ 100 - R$ 200"
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-taupe mb-2">Valor Base (R$ numérico)</label>
            <input 
              type="number" 
              value={valor}
              onChange={(e) => setValor(parseFloat(e.target.value))}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-taupe mb-2">Caminho da Imagem Principal</label>
            <input 
              type="text" 
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              placeholder="Ex: /media/coroas/1.png ou https://github.com/..."
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
            />
            <p className="text-xs text-taupe/70 mt-2">Você pode usar URLs do GitHub para não pesar o banco.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSaveItem}
            disabled={saving}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Salvar Dados Principais
          </button>
        </div>
      </div>

      {/* MODELOS */}
      <div className="bg-card/50 border border-border/70 p-6 md:p-8 rounded-3xl backdrop-blur shadow-soft">
        <div className="flex justify-between items-center border-b border-border/50 pb-4 mb-6">
          <h2 className="text-xl font-serif text-ui-text">Modelos / Opções (Galeria)</h2>
          <button 
            onClick={handleOpenAddModal}
            className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Adicionar Modelo
          </button>
        </div>

        {/* Lista de Modelos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {modelos.length === 0 ? (
            <p className="text-taupe col-span-3 text-center py-4">Nenhum modelo adicionado a esta homenagem.</p>
          ) : (
            modelos.map(modelo => (
              <div key={modelo.id} className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col relative group">
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    onClick={(e) => handleEditClick(e, modelo)}
                    className="bg-blue-500/80 text-white p-2 rounded-lg hover:bg-blue-600 shadow-sm"
                    title="Editar modelo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); requestDelete(modelo.id); }}
                    className="bg-red-500/80 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm"
                    title="Excluir modelo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="aspect-square bg-muted/30 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={modelo.imagem} alt={modelo.nome} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <h4 className="font-medium text-ui-text truncate">{modelo.nome || "Sem nome"}</h4>
                  {modelo.valor ? (
                    <p className="text-sm text-primary mt-1 font-medium">R$ {modelo.valor.toFixed(2)}</p>
                  ) : (
                    <p className="text-sm text-taupe mt-1">Valor base: R$ {valor.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE MODELO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-taupe hover:text-red-500 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-serif text-ui-text mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
              {editingModelId ? (
                <><Edit2 className="w-6 h-6 text-primary"/> Editar Modelo</>
              ) : (
                <><Plus className="w-6 h-6 text-primary"/> Adicionar Novo Modelo</>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-taupe mb-2">Nome/Identificador</label>
                <input 
                  type="text" 
                  value={novoModeloNome}
                  onChange={(e) => setNovoModeloNome(e.target.value)}
                  placeholder="Ex: Coroa Branca"
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-taupe mb-2">Valor Individual (Opcional)</label>
                <input 
                  type="number" 
                  value={novoModeloValor}
                  onChange={(e) => setNovoModeloValor(e.target.value)}
                  placeholder={`Vazio = R$ ${valor.toFixed(2)}`}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-taupe mb-2">Caminho da Imagem (GitHub ou /media/...)</label>
                <input 
                  type="text" 
                  value={novoModeloImagem}
                  onChange={(e) => setNovoModeloImagem(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-ui-text focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button 
                onClick={handleCancelEdit}
                className="text-taupe px-6 py-3 hover:text-ui-text transition-colors font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveModel}
                disabled={adicionandoModelo}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium tracking-wide hover:bg-primary/90 transition-colors shadow-soft disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {adicionandoModelo ? "Salvando..." : (editingModelId ? "Salvar Alterações" : "Adicionar Modelo")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir Modelo"
        description="Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setModeloToDelete(null);
        }}
      />
    </div>
  );
}
