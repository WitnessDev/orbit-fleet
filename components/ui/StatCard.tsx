interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  status?: "primary" | "success" | "warning" | "danger";
}

export default function StatCard({
  label,
  value,
  detail,
  status = "primary",
}: StatCardProps) {
  const colors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  const dots = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-muted">
          {label}
        </p>

        <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      </div>

      <p
        className={`mt-4 font-display text-3xl font-semibold tracking-tight ${colors[status]}`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-text-muted">{detail}</p>
    </div>
  );
}
