"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import QRCode from "react-qr-code";
import { TotemScreen } from '../../components/TotemScreen'
import { StepBar } from '../../components/StepBar'
import { useHomenagem } from '../../lib/homenagem-store'

import { formatCurrency } from '../../lib/utils'
import { StickyActionBar } from '../../components/StickyActionBar'
import { PrimaryButton } from '../../components/PrimaryButton'
import { STRINGS } from '../../data/strings'
import { FlowGuard } from '../../components/FlowGuard'
import { generatePixPayload } from '../../lib/pix'
import { enqueueOrder } from '../../lib/sync-queue'

export default function PagamentoPage() {
  const navigate = useRouter()
  const { homenagem, ong, obitoId, nomeCliente, telefoneCliente, anonimo, modelo, frase, fotos, valorPersonalizado } = useHomenagem()

  const pixPayload = useMemo(() => {
    if (!ong || !ong.chavePix || !homenagem) return "";
    
    // Valor Cobrado (se houver valorPersonalizado usa ele, senão modelo, senão base)
    const valorCobrado = valorPersonalizado ?? modelo?.valor ?? homenagem.valor;
    
    return generatePixPayload(
      ong.chavePix,
      ong.pixTitular || ong.nome,
      ong.pixCidade || "CIDADE",
      valorCobrado
    );
  }, [ong, homenagem, modelo, valorPersonalizado]);

  if (!homenagem || !ong) {
    return null
  }

  const hasQrImage = !!ong.qrCodeImagem;

  return (
    <FlowGuard require="both" fallback="/catalogo">
      <TotemScreen back="/identificacao">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
          <StepBar currentStep={4} />

          <div className="text-center mb-12 animate-gentle-fade">
            <h1 className="font-serif text-3xl md:text-4xl text-ui-text mb-3">{STRINGS.pagamento.titulo}</h1>
            <p className="text-taupe text-base md:text-lg">{STRINGS.pagamento.subtitulo}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-center justify-center pb-32">

            <div className="flex flex-col items-center animate-rise" style={{ animationDelay: '100ms' }}>
              <div className="bg-white shadow-card p-4 rounded-3xl mb-6">
                {hasQrImage ? (
                  <img
                    src={ong.qrCodeImagem}
                    alt="QR Code PIX"
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                ) : pixPayload ? (
                  <QRCode
                    value={pixPayload}
                    size={192}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    className="rounded-xl"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-muted/50 rounded-xl text-taupe text-center p-4">
                    Chave PIX não configurada
                  </div>
                )}
              </div>

              <p className="text-taupe uppercase tracking-widest text-xs mb-1">{STRINGS.pagamento.metodo}</p>
              <p className="font-serif text-3xl md:text-4xl text-primary mb-4">{formatCurrency(valorPersonalizado ?? modelo?.valor ?? homenagem.valor)}</p>

              {ong.chavePix && (
                <div className="bg-muted/40 px-4 py-2 rounded-xl border border-border/50 text-center max-w-[250px]">
                  <p className="text-xs text-taupe mb-1 uppercase tracking-wider">Chave PIX Destino:</p>
                  <p className="text-ui-text font-mono font-medium truncate">{ong.chavePix}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-96 bg-muted/60 p-6 md:p-8 rounded-3xl animate-rise" style={{ animationDelay: '200ms' }}>
              <h3 className="font-serif text-xl md:text-2xl text-ui-text mb-6">{STRINGS.pagamento.resumo}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.pagamento.gesto}</p>
                  <p className="text-lg text-ui-text">{modelo ? `${homenagem.nome} - ${modelo.nome}` : homenagem.nome}</p>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div>
                  <p className="text-taupe text-sm uppercase tracking-wider mb-1">{STRINGS.pagamento.destino}</p>
                  <p className="text-lg text-primary/90">{ong.nome}</p>
                  <p className="text-taupe text-sm mt-1">{ong.causa}</p>
                </div>
              </div>
            </div>

          </div>

          <StickyActionBar>
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-4">
              <div className="bg-primary/10 border border-primary/20 text-primary-foreground p-4 rounded-2xl text-center w-full shadow-sm animate-pulse">
                <p className="font-bold text-lg text-primary">{STRINGS.pagamento.atencaoTitulo}</p>
                <p className="text-sm text-ui-text">{STRINGS.pagamento.atencaoCorpo}</p>
              </div>
              <div className="w-full flex justify-center">
                <PrimaryButton
                  className="w-full md:w-auto text-center justify-center"
                  onClick={async () => {
                    const orderPayload = {
                      catalogItemId: homenagem.id,
                      institutionId: ong.id,
                      obitoId: obitoId || null,
                      nomeCliente: nomeCliente || null,
                      telefoneCliente: telefoneCliente || null,
                      anonimo: anonimo,
                      modeloNome: modelo?.nome || null,
                      valorPago: valorPersonalizado ?? modelo?.valor ?? homenagem.valor,
                      status: 'PENDENTE',
                      frase: frase || null,
                      fotos: fotos.map(f => f.src),
                      legendaFotos: fotos.map(f => f.legenda),
                    };

                    try {
                      const res = await fetch('/api/pedidos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderPayload)
                      });
                      
                      if (!res.ok) throw new Error("Falha ao salvar no banco");
                    } catch (e) {
                      console.warn("Servidor inacessível. Salvando pedido na fila offline.", e);
                      enqueueOrder(orderPayload);
                    }
                    
                    navigate.push('/confirmacao');
                  }}
                >
                  {STRINGS.pagamento.botaoFinalizar}
                </PrimaryButton>
              </div>
            </div>
          </StickyActionBar>
        </div>
      </TotemScreen>
    </FlowGuard>
  )
}
