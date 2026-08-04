import { Navigate, Outlet, useParams } from "react-router";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AiChatWidget } from "@/features/ai-chat/components/AiChatWidget";
import { useProject } from "@/hooks/queries/useProject";

/** Protected app shell: resolves the active project from the URL, then renders Sidebar + Topbar + <Outlet/>. */
export function AppLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError, refetch } = useProject(projectId);

  if (isLoading) return <PageLoader label="Loading workspace…" />;
  if (isError) {
    return (
      <div className="p-8">
        <QueryErrorFallback message="We couldn't load this workspace." onRetry={() => refetch()} />
      </div>
    );
  }
  if (!project || !project.connected) return <Navigate to="/projects" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar project={project} />
      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-7 pb-16">
          <Outlet context={{ project }} />
        </div>
      </main>
      <AiChatWidget project={project} />
    </div>
  );
}
