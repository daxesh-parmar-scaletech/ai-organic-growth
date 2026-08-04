import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "competitors"
  | "content-generation"
  | "seo-analysis"
  | "free-tools"
  | "settings";

export interface NavItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  badge?: string;
}
