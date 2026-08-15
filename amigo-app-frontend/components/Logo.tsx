export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#0F6E6E" />
      <circle cx="17" cy="21" r="3.4" fill="#F4F7F8" />
      <circle cx="31" cy="21" r="3.4" fill="#F4F7F8" />
      <path
        d="M15 30c3 3 15 3 18 0"
        stroke="#F4F7F8"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M6 39c8 3 28 3 36 0"
        stroke="#E3A008"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="1 6"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      Amigo
    </span>
  );
}

export function Brand({ size = "h-9 w-9", textClass = "text-xl" }: { size?: string; textClass?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className={size} />
      <Wordmark className={textClass} />
    </div>
  );
}
