import React, { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  status?: "primary" | "success" | "warning" | "danger" | "info";
  icon?: LucideIcon | ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

export default function StatCard({
  label,
  value,
  detail,
  status = "primary",
  icon,
  trend,
  className = "",
}: StatCardProps) {
  const statusStyles = {
    primary: {
      dot: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      valueColor: "text-text-primary",
      highlight: "group-hover:border-emerald-200",
    },
    success: {
      dot: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      valueColor: "text-emerald-700",
      highlight: "group-hover:border-emerald-200",
    },
    warning: {
      dot: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-700 border-amber-100",
      valueColor: "text-amber-700",
      highlight: "group-hover:border-amber-200",
    },
    danger: {
      dot: "bg-rose-500",
      iconBg: "bg-rose-50 text-rose-700 border-rose-100",
      valueColor: "text-rose-700",
      highlight: "group-hover:border-rose-200",
    },
    info: {
      dot: "bg-sky-500",
      iconBg: "bg-sky-50 text-sky-700 border-sky-100",
      valueColor: "text-sky-700",
      highlight: "group-hover:border-sky-200",
    },
  };

  const currentTheme = statusStyles[status] || statusStyles.primary;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div
      tabIndex={0}
      className={`group relative flex flex-col justify-between rounded-[20px] border border-border bg-surface p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${currentTheme.highlight} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors group-hover:scale-105 ${currentTheme.iconBg}`}
            >
              {renderIcon()}
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {label}
            </p>
          </div>
        </div>

        <span
          className={`h-2 w-2 rounded-full ring-4 ring-white transition-transform duration-300 group-hover:scale-125 ${currentTheme.dot}`}
        />
      </div>

      <div className="mt-4">
        <p
          className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${currentTheme.valueColor}`}
        >
          {value}
        </p>

        {(detail || trend) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {trend && (
              <span
                className={`inline-flex items-center font-bold font-mono px-1.5 py-0.5 rounded-md ${
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {trend?.label && <span>{trend.label}</span>}
            {detail && !trend && <span>{detail}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
