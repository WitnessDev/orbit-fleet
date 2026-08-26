import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";

interface WorkspacePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function WorkspacePage({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  actionLabel,
  actionHref,
}: WorkspacePageProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-8 lg:py-8 lg:pl-80">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashbord"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          </div>
        </header>

        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="font-display text-base font-bold">{title}</h2>
            <p className="mt-1 text-xs text-text-muted">Workspace data will appear here as it is connected.</p>
          </div>
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold">{emptyTitle}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{emptyDescription}</p>
            {actionLabel && actionHref && (
              <Link
                href={actionHref}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
              >
                {actionLabel}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
