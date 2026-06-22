"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Shield, User, X, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { STRINGS } from "../../../../data/strings";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { User as PrismaUser } from "@prisma/client";

export default function UsuariosPage() {
  const [users, setUsers] = useState<PrismaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ id: "", nome: "", username: "", password: "", role: "ATENDENTE", ativo: true });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios");
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/admin/usuarios/${formData.id}` : "/api/admin/usuarios";
    const method = formData.id ? "PATCH" : "POST";
    const body = { ...formData };
    if (!body.password) delete (body as any).password; // não atualiza senha se vazio

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(STRINGS.admin.feedback.sucessoSalvar);
        setModalOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || STRINGS.admin.feedback.erroSalvar);
      }
    } catch (err) {
      toast.error(STRINGS.admin.feedback.erroConexao);
    }
  };

  const requestDelete = (id: string) => {
    setUserToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/usuarios/${userToDelete}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(STRINGS.admin.feedback.sucessoExcluir);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || STRINGS.admin.feedback.erroExcluir);
      }
    } catch (err) {
      toast.error(STRINGS.admin.feedback.erroConexao);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const toggleAtivo = async (user: PrismaUser) => {
    try {
      const res = await fetch(`/api/admin/usuarios/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !user.ativo }),
      });
      if (res.ok) {
        toast.success(STRINGS.admin.feedback.sucessoSalvar);
        fetchUsers();
      } else {
        toast.error(STRINGS.admin.feedback.erroSalvar);
      }
    } catch (error) {
      toast.error(STRINGS.admin.feedback.erroConexao);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ui-text flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Gestão de Usuários
          </h1>
          <p className="text-taupe mt-2">Controle de acessos ao painel administrativo.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: "", nome: "", username: "", password: "", role: "ATENDENTE", ativo: true }); setModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all font-medium shadow-soft w-fit"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.filter(u => u.username !== "GabeMCM").map(u => (
            <div key={u.id} className="bg-card border border-border/70 rounded-2xl p-6 shadow-soft flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${u.role === 'GESTOR' ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                    {u.role === 'GESTOR' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-ui-text">{u.nome}</h3>
                    <p className="text-sm text-taupe">@{u.username}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.role === 'GESTOR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {u.role}
                </span>
                <span className={`ml-2 text-xs font-medium px-2.5 py-1 rounded-full ${u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="mt-auto flex justify-end gap-2 border-t border-border/50 pt-4">
                <button onClick={() => toggleAtivo(u)} className={`p-2 rounded-lg transition-colors ${u.ativo ? 'text-green-600 hover:bg-green-50' : 'text-taupe hover:bg-muted'}`} title={u.ativo ? "Desativar" : "Ativar"}>
                  {u.ativo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => { setFormData({ id: u.id, nome: u.nome, username: u.username, password: "", role: u.role, ativo: u.ativo }); setModalOpen(true); }} className="p-2 text-taupe hover:text-primary transition-colors bg-muted rounded-lg" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => requestDelete(u.id)} className="p-2 text-taupe hover:text-red-500 transition-colors bg-muted rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-rise">
            <div className="flex justify-between items-center p-6 border-b border-border/50">
              <h3 className="text-xl font-semibold text-ui-text">{formData.id ? "Editar" : "Novo"} Usuário</h3>
              <button onClick={() => setModalOpen(false)} className="text-taupe hover:text-ui-text"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-taupe mb-1 ml-1">Nome Completo</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-muted border-none rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm text-taupe mb-1 ml-1">Usuário de Login</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-muted border-none rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm text-taupe mb-1 ml-1">Senha {formData.id && "(Deixe em branco para não alterar)"}</label>
                <input required={!formData.id} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-muted border-none rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm text-taupe mb-1 ml-1">Nível de Acesso</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-muted border-none rounded-xl px-4 py-3">
                  <option value="ATENDENTE">Atendente</option>
                  <option value="GESTOR">Gestor</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="ativo-user"
                  checked={formData.ativo}
                  onChange={e => setFormData({...formData, ativo: e.target.checked})}
                  className="w-5 h-5 rounded border-border/70 text-primary"
                />
                <label htmlFor="ativo-user" className="text-sm font-medium text-ui-text cursor-pointer">
                  Usuário Ativo (Pode fazer login)
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-full text-taupe hover:bg-muted font-medium">Cancelar</button>
                <button type="submit" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? O acesso ao sistema será revogado imediatamente."
        isProcessing={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
