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
    | "suspended"
    | "available"
    | "on_trip"
    | "off_duty"
    | "super_admin"
    | "manager"
    | "driver";
}

export default function Badge({
  children,
  status = "info",
}: BadgeProps) {
  const styles: Record<string, string> = {
    online: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    
    idle: "bg-amber-50 text-amber-700 border border-amber-200",
    on_trip: "bg-blue-50 text-blue-700 border border-blue-200",
    maintenance: "bg-amber-50 text-amber-700 border border-amber-200",

    offline: "bg-rose-50 text-rose-700 border border-rose-200",
    suspended: "bg-rose-50 text-rose-700 border border-rose-200",
    off_duty: "bg-slate-100 text-slate-600 border border-slate-200",
    inactive: "bg-slate-100 text-slate-600 border border-slate-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",

    super_admin: "bg-purple-50 text-purple-700 border border-purple-200",
    manager: "bg-teal-50 text-teal-700 border border-teal-200",
    driver: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const dots: Record<string, string> = {
    online: "bg-emerald-500",
    active: "bg-emerald-500",
    available: "bg-emerald-500",

    idle: "bg-amber-500",
    on_trip: "bg-blue-500",
    maintenance: "bg-amber-500",

    offline: "bg-rose-500",
    suspended: "bg-rose-500",
    off_duty: "bg-slate-400",
    inactive: "bg-slate-400",
    info: "bg-sky-500",

    super_admin: "bg-purple-500",
    manager: "bg-teal-500",
    driver: "bg-slate-500",
  };

  const currentStyle = styles[status] || styles.info;
  const currentDot = dots[status] || dots.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${currentStyle}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${currentDot}`} />
      {children}
    </span>
  );
}
