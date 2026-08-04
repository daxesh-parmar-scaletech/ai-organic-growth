import { SectionCard } from "@/components/common/SectionCard";
import type { Project } from "@/types/project";

export function ConnectedPropertiesCard({ projects }: { projects: Project[] }) {
  return (
    <SectionCard title="Connected properties">
      <div className="flex flex-col">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-3 border-t border-border py-2.75 first:border-t-0">
            <span
              className="flex size-8 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.letter}
            </span>
            <span className="flex-1 text-[13.5px] font-semibold">{project.domain}</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Connected
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
