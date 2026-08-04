import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onConnect: (project: Project) => void;
}

export function ProjectCard({ project, onConnect }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4.5 rounded-2xl border border-border bg-card p-5.5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: project.color }}
        >
          {project.letter}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold tracking-tight">{project.name}</div>
          <div className="truncate text-[13px] text-muted-foreground">{project.domain}</div>
        </div>
        <span
          className={
            project.connected
              ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
              : "rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground"
          }
        >
          {project.connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {project.connected && project.metrics ? (
        <div className="flex gap-2">
          <div className="flex-1 rounded-[10px] bg-muted/60 px-3 py-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground">CLICKS / 28d</div>
            <div className="mt-0.5 text-base font-bold">{project.metrics.clicks}</div>
          </div>
          <div className="flex-1 rounded-[10px] bg-muted/60 px-3 py-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground">IMPRESSIONS</div>
            <div className="mt-0.5 text-base font-bold">{project.metrics.impressions}</div>
          </div>
          <div className="flex-1 rounded-[10px] bg-muted/60 px-3 py-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground">AVG POS</div>
            <div className="mt-0.5 text-base font-bold">{project.metrics.avgPosition}</div>
          </div>
        </div>
      ) : (
        <div className="rounded-[10px] border border-dashed border-border bg-muted/40 p-3.5 text-[13px] leading-relaxed text-muted-foreground">
          Grant access to unlock search performance, indexing and AI growth recommendations.
        </div>
      )}

      {project.connected ? (
        <Button variant="dark" onClick={() => navigate(`/app/${project.id}/dashboard`)}>
          Open dashboard
        </Button>
      ) : (
        <Button variant="outline" onClick={() => onConnect(project)}>
          Connect
        </Button>
      )}
    </div>
  );
}
