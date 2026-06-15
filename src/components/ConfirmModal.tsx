import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  warningText?: string;
  confirmKeyword?: string;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  warningText,
  confirmKeyword,
  isProcessing,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-card w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl animate-rise">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-ui-text">{title}</h3>
            <p className="text-taupe text-sm">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        
        <p className="text-ui-text mb-4">
          {description}
        </p>
        {confirmKeyword && warningText && (
          <p className="text-ui-text mb-6">
            {warningText} <strong className="text-red-600">{confirmKeyword}</strong> no campo abaixo:
          </p>
        )}
        
        {confirmKeyword && (
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Digite ${confirmKeyword}`}
            className="w-full bg-muted/50 border border-border/70 rounded-xl px-4 py-3 mb-8 text-ui-text focus:outline-none focus:ring-2 focus:ring-red-500/50 uppercase font-mono"
          />
        )}
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setInputText("");
              onCancel();
            }}
            className="px-6 py-3 rounded-full font-medium text-taupe hover:bg-muted/80 transition-colors"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setInputText("");
              onConfirm();
            }}
            disabled={(confirmKeyword ? inputText !== confirmKeyword : false) || isProcessing}
            className="px-6 py-3 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Apagar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
