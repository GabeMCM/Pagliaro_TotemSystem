"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export function DashboardCharts({ 
  mensalData, 
  instituicaoData,
  estatisticas
}: { 
  mensalData: any[]; 
  instituicaoData: any[];
  estatisticas: {
    totalDoadores: number;
    mediaPorDoador: number;
    mediaMensal: number;
  }
}) {
  return (
    <div className="space-y-4 md:space-y-5 mt-4 md:mt-6">
      {/* Estatísticas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Total de Doadores Únicos</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">{estatisticas.totalDoadores}</p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">Pessoas que já doaram</p>
        </div>
        
        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Média por Doador</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas.mediaPorDoador)}
          </p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">Ticket médio de doações</p>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-2">Média Arrecadada / Mês</h3>
          <p className="text-2xl md:text-3xl font-semibold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas.mediaMensal)}
          </p>
          <p className="text-xs md:text-sm text-taupe mt-1 md:mt-2">Arrecadação média mensal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Gráfico 1: Arrecadação Mensal */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-6">Arrecadação por Mês</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={mensalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Arrecadação por Instituição */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 md:p-5 shadow-soft">
          <h3 className="font-medium text-ui-text mb-6">Arrecadação por Instituição</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={instituicaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nome" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
