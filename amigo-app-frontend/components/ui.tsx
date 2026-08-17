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
    primary: "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-card",
    secondary: "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500",
    ghost: "bg-transparent text-slate-650 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800/80",
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
  PENDING: "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300",
  DISPATCHED: "bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/20",
  ARRIVED: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/20",
  DELIVERED: "bg-sage-400/15 text-sage-500 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/20",
  FAILED: "bg-coral-400/15 text-coral-500 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/20",
  IDLE: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/20",
  DELIVERING: "bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/20",
  RETURNING: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/20",
  CHARGING: "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300",
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
        statusStyles[status] ?? "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl2 bg-white dark:bg-[#152228] shadow-card dark:shadow-none border border-teal-900/5 dark:border-slate-800/80 ${className}`}
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
      <span className="mb-1.5 block text-sm font-medium text-slate-650 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-650/70 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-teal-900/10 dark:border-slate-700 bg-mist dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 placeholder:text-slate-650/50 dark:placeholder:text-slate-500 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition";
