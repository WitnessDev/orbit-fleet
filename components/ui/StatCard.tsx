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
      dot: "bg-emerald-500 ring-emerald-100",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      valueColor: "text-slate-900",
      accentBorder: "group-hover:border-emerald-300",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    success: {
      dot: "bg-emerald-500 ring-emerald-100",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      valueColor: "text-emerald-700",
      accentBorder: "group-hover:border-emerald-300",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    warning: {
      dot: "bg-amber-500 ring-amber-100",
      iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
      valueColor: "text-slate-900",
      accentBorder: "group-hover:border-amber-300",
      pillBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
    danger: {
      dot: "bg-rose-500 ring-rose-100",
      iconBg: "bg-rose-50 text-rose-700 border-rose-200/80",
      valueColor: "text-slate-900",
      accentBorder: "group-hover:border-rose-300",
      pillBg: "bg-rose-50 text-rose-800 border-rose-200",
    },
    info: {
      dot: "bg-sky-500 ring-sky-100",
      iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      valueColor: "text-slate-900",
      accentBorder: "group-hover:border-sky-300",
      pillBg: "bg-sky-50 text-sky-800 border-sky-200",
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
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 min-h-[140px] ${currentTheme.accentBorder} ${className}`}
    >
      {/* Top row: Label + Icon + Status pulse dot */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${currentTheme.iconBg}`}
            >
              {renderIcon()}
            </div>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {label}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`h-2.5 w-2.5 rounded-full ring-4 transition-transform duration-300 group-hover:scale-110 ${currentTheme.dot}`}
          />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${currentTheme.valueColor}`}
          >
            {value}
          </p>

          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold font-mono border shrink-0 ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span>{trend.value}</span>
            </span>
          )}
        </div>

        {/* Secondary Detail Text */}
        {(detail || trend?.label) && (
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
            {trend?.label ? trend.label : detail}
          </p>
        )}
      </div>
    </div>
  );
}
