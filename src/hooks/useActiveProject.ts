import { useOutletContext } from "react-router";
import type { Project } from "@/types/project";

interface AppLayoutContext {
  project: Project;
}

/** Reads the active project resolved once by `AppLayout`, avoiding a re-fetch per feature page. */
export function useActiveProject(): Project {
  return useOutletContext<AppLayoutContext>().project;
}
