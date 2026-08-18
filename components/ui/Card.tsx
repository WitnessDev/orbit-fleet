import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-[var(--shadow-card)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}