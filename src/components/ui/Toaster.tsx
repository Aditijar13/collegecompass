"use client";
import { useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType; }

let addToast: (m: string, t?: ToastType) => void = () => {};
export const toast = {
  success: (m: string) => addToast(m, "success"),
  error: (m: string) => addToast(m, "error"),
  info: (m: string) => addToast(m, "info"),
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  addToast = (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = { success: "#10b981", error: "#ef4444", info: "#f97316" };
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", minWidth: 280, background: "rgb(28,28,36)", border: "0.8px solid rgba(255,255,255,0.1)", borderRadius: 12, boxShadow: "0 16px 32px rgba(0,0,0,0.4)", animation: "fade-up 0.3s ease forwards" }}>
            <Icon size={15} color={colors[t.type]} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#d1d5db", flex: 1 }}>{t.message}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563" }}><X size={13} /></button>
          </div>
        );
      })}
    </div>
  );
}
