import prisma from "../../../lib/prisma";
import { formatCurrency } from "../../../lib/utils";
import { DashboardCharts } from "../../../components/admin/DashboardCharts";
import { AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const pedidosPendentes = await prisma.order.count({
    where: { status: 'PENDENTE' }
  });

  const pedidosRealizados = await prisma.order.count({
    where: { status: { not: 'PENDENTE' } }
  });

  const ongsCount = await prisma.institution.count();
  
  const allOrders = await prisma.order.findMany({
    where: { status: { in: ['PAGO', 'FINALIZADO'] } },
    include: { institution: true }
  });

  // Cálculos Básicos
  const totalArrecadado = allOrders.reduce((acc, curr) => acc + curr.valorPago, 0);
  
  // Gráfico: Mensal
  const mensalMap = new Map<string, number>();
  allOrders.forEach(order => {
    // Formato 'MM/YYYY' ou 'MMM YYYY'
    const mes = order.updatedAt.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    mensalMap.set(mes, (mensalMap.get(mes) || 0) + order.valorPago);
  });
  const mensalData = Array.from(mensalMap.entries()).map(([mes, total]) => ({ mes, total }));

  // Gráfico: Instituição
  const instMap = new Map<string, number>();
  allOrders.forEach(order => {
    const nome = order.institution.nome;
    instMap.set(nome, (instMap.get(nome) || 0) + order.valorPago);
  });
  const instituicaoData = Array.from(instMap.entries()).map(([nome, total]) => ({ nome, total }));

  // Estatísticas Avançadas
  const totalDoadores = new Set(allOrders.filter(o => o.telefoneCliente).map(o => o.telefoneCliente)).size || 1; 
  const mediaPorDoador = totalArrecadado / (totalDoadores > 0 ? totalDoadores : 1);
  const mediaMensal = mensalData.length > 0 ? (totalArrecadado / mensalData.length) : totalArrecadado;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-ui-text">Painel Administrativo</h1>
          <p className="text-taupe text-sm md:text-base mt-1">Visão geral do sistema Culto da Saudade.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Pedidos Pendentes (Em Alerta se > 0) */}
        <div className={`border rounded-2xl p-4 md:p-5 shadow-soft transition-colors ${pedidosPendentes > 0 ? 'bg-red-50 border-red-200' : 'bg-card border-border/70'}`}>
          <div className="flex justify-between items-start">
            <h3 className={`font-medium mb-2 ${pedidosPendentes > 0 ? 'text-red-700' : 'text-ui-text'}`}>Pedidos Pendentes</h3>
            {pedidosPendentes > 0 && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
          <p className={`text-3xl font-semibold ${pedidosPendentes > 0 ? 'text-red-600' : 'text-primary'}`}>{pedidosPendentes}</p>
          <p className={`text-sm mt-2 ${pedidosPendentes > 0 ? 'text-red-600/70' : 'text-taupe'}`}>Aguardando confirmação</p>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Pedidos Concluídos</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">{pedidosRealizados}</p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">Pedidos pagos no total</p>
        </div>
        
        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Instituições</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">{ongsCount}</p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">ONGs cadastradas ativas</p>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Arrecadação Acumulada</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">{formatCurrency(totalArrecadado)}</p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">Total pago histórico</p>
        </div>
      </div>

      <DashboardCharts 
        mensalData={mensalData} 
        instituicaoData={instituicaoData} 
        estatisticas={{ totalDoadores, mediaPorDoador, mediaMensal }} 
      />
      
    </div>
  );
}
