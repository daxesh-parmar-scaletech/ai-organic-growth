import { CalendarDays } from "lucide-react";
import { useLocation } from "react-router";
import { MODULE_TITLES } from "@/lib/constants";
import type { ModuleId } from "@/types/nav";

export function Topbar() {
  const location = useLocation();
  const activeModuleId = location.pathname.split("/")[3] as ModuleId;
  const title = MODULE_TITLES[activeModuleId] ?? "Dashboard";

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-5 border-b border-border bg-card px-7">
      <div className="min-w-0 text-lg font-bold tracking-tight text-foreground">{title}</div>
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-[10px] border border-border px-3 py-2 text-sm font-semibold text-muted-foreground">
          <CalendarDays className="size-[15px]" />
          Last 28 days
        </div>
      </div>
    </div>
  );
}
