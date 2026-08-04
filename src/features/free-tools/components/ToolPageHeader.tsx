import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

interface ToolPageHeaderProps {
  title: string;
  description: string;
}

export function ToolPageHeader({ title, description }: ToolPageHeaderProps) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex flex-col gap-2">
      <Link
        to={`/app/${projectId}/free-tools`}
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Free Tools
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
