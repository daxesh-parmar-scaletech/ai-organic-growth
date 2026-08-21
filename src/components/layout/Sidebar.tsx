import { ChevronsUpDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Logo } from "@/components/common/Logo";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/lib/constants";
import type { Project } from "@/types/project";

interface SidebarProps {
  project: Project;
}

export function Sidebar({ project }: SidebarProps) {
  const location = useLocation();
  const activeModuleId = location.pathname.split("/")[3];
  const { user } = useAuth();
  const isAdmin = user?.roleName === "Admin";
  const navItems = NAV_ITEMS.filter((item) => item.id !== "settings" || isAdmin);

  return (
    <aside className="flex h-full w-[246px] shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo iconSize={36} />
      </div>

      <div className="p-3.5 pb-1">
        <Link
          to="/projects"
          className="flex w-full items-center gap-2.5 rounded-[11px] border border-border bg-muted/40 px-2.5 py-2 text-left hover:bg-muted"
        >
          <span
            className="flex size-[30px] shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.letter}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-bold">{project.name}</span>
            <span className="block truncate text-[11.5px] text-muted-foreground">{project.domain}</span>
          </span>
          <ChevronsUpDown className="size-[15px] shrink-0 text-muted-foreground" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="px-3 pt-2 pb-1.5 text-[10.5px] font-bold tracking-wider text-muted-foreground">
          WORKSPACE
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              projectId={project.id}
              isActive={activeModuleId === item.id}
            />
          ))}
        </div>
      </nav>

      <UserMenu />
    </aside>
  );
}
