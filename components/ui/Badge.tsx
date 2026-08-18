interface BadgeProps {
  children: React.ReactNode;
  status?: "online" | "idle" | "offline" | "info";
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
  };

  const dots = {
    online: "bg-success",
    idle: "bg-warning",
    offline: "bg-danger",
    info: "bg-info",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {children}
    </span>
  );
}