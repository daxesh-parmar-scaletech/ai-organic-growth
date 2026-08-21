import { CalendarDays, Settings } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { MODULE_TITLES } from "@/lib/constants";
import type { ModuleId } from "@/types/nav";

export function Topbar() {
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const activeModuleId = location.pathname.split("/")[3] as ModuleId;
  const title = MODULE_TITLES[activeModuleId] ?? "Dashboard";
  const isAdmin = user?.roleName === "Admin";

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-5 border-b border-border bg-card px-7">
      <div className="min-w-0 text-lg font-bold tracking-tight text-foreground">{title}</div>
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-[10px] border border-border px-3 py-2 text-sm font-semibold text-muted-foreground">
          <CalendarDays className="size-[15px]" />
          Last 28 days
        </div>
        {isAdmin ? (
          <Link
            to={`/app/${projectId}/settings`}
            title="Settings"
            className="flex items-center justify-center rounded-[10px] border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-[15px]" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
