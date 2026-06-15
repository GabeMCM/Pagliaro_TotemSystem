import prisma from "../../../lib/prisma";
import { formatCurrency } from "../../../lib/utils";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const pedidosCount = await prisma.order.count();
  const ongsCount = await prisma.institution.count();
  
  const arrecadacaoResult = await prisma.order.aggregate({
    where: {
      status: {
        in: ['PAGO', 'FINALIZADO']
      }
    },
    _sum: {
      valorPago: true
    }
  });
  
  const totalArrecadado = arrecadacaoResult._sum.valorPago || 0;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-ui-text">Painel Administrativo</h1>
          <p className="text-taupe">Visão geral do sistema Culto da Saudade.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Homenagens</h3>
          <p className="text-3xl font-serif text-primary">{pedidosCount}</p>
          <p className="text-sm text-taupe mt-2">Pedidos realizados no total</p>
        </div>
        
        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Instituições</h3>
          <p className="text-3xl font-serif text-primary">{ongsCount}</p>
          <p className="text-sm text-taupe mt-2">ONGs cadastradas ativas</p>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Arrecadação</h3>
          <p className="text-3xl font-serif text-primary">{formatCurrency(totalArrecadado)}</p>
          <p className="text-sm text-taupe mt-2">Total pago ou finalizado</p>
        </div>
      </div>
      
    </div>
  );
}
