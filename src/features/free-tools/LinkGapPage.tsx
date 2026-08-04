import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useActiveProject } from '@/hooks/useActiveProject';

export function LinkGapPage() {
  const project = useActiveProject();

  return (
    <div className="flex h-full flex-col gap-4">
      <Link
        to={`/app/${project.id}/free-tools`}
        className="flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Tools
      </Link>

      <iframe
        src="https://linkgap.io/"
        title="Link Gap"
        className="min-h-[80vh] w-full flex-1 rounded-lg border border-border"
      />
    </div>
  );
}
