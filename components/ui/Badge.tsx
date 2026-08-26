interface BadgeProps {
  children: React.ReactNode;
  status?:
    | "online"
    | "idle"
    | "offline"
    | "info"
    | "active"
    | "inactive"
    | "maintenance"
    | "suspended";
}

export default function Badge({
  children,
  status = "info",
}: BadgeProps) {
  const styles = {
    online: "bg-success-light text-success",
    idle: "bg-warning-light text-warning",
    offline: "bg-danger-light text-danger",
    info: "bg-info-light text-info",

    active: "bg-success-light text-success",
    inactive: "bg-slate-100 text-slate-500",
    maintenance: "bg-warning-light text-warning",
    suspended: "bg-danger-light text-danger",
  };

  const dots = {
    online: "bg-success",
    idle: "bg-warning",
    offline: "bg-danger",
    info: "bg-info",

    active: "bg-success",
    inactive: "bg-slate-400",
    maintenance: "bg-warning",
    suspended: "bg-danger",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[status]}`}
      />

      {children}
    </span>
  );
}
