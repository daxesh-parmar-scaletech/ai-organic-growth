import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/nav';

interface SidebarNavItemProps {
  item: NavItem;
  projectId: string;
  isActive: boolean;
}

export function SidebarNavItem({ item, projectId, isActive }: SidebarNavItemProps) {
  const Icon = item.icon;
  return (
    <Link
      to={`/app/${projectId}/${item.id}`}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
