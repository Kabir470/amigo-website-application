import { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2";
  const sizes = { sm: "px-3.5 py-1.5 text-sm", md: "px-5 py-2.5 text-sm" };
  const variants = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 shadow-card",
    secondary: "bg-white text-teal-700 border border-teal-100 hover:border-teal-400",
    ghost: "bg-transparent text-slate-650 hover:bg-teal-50",
    danger: "bg-coral-500 text-white hover:bg-coral-400",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-650",
  DISPATCHED: "bg-amber-50 text-amber-500",
  ARRIVED: "bg-teal-50 text-teal-600",
  DELIVERED: "bg-sage-400/15 text-sage-500",
  FAILED: "bg-coral-400/15 text-coral-500",
  IDLE: "bg-teal-50 text-teal-600",
  DELIVERING: "bg-amber-50 text-amber-500",
  RETURNING: "bg-teal-50 text-teal-600",
  CHARGING: "bg-slate-100 text-slate-650",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  DISPATCHED: "En route",
  ARRIVED: "Arrived — awaiting confirmation",
  DELIVERED: "Delivered",
  FAILED: "Failed",
  IDLE: "Idle at dock",
  DELIVERING: "Delivering",
  RETURNING: "Returning to dock",
  CHARGING: "Charging",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
        statusStyles[status] ?? "bg-slate-100 text-slate-650"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl2 bg-white shadow-card border border-teal-900/5 ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-650">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-650/70">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-teal-900/10 bg-mist px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-650/50 focus:border-teal-500 focus:bg-white focus:outline-none transition";
