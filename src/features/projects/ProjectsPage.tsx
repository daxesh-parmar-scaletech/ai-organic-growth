import { Activity, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Logo } from '@/components/common/Logo';
import { PageLoader } from '@/components/common/PageLoader';
import { QueryErrorFallback } from '@/components/common/QueryErrorFallback';
import { Button } from '@/components/ui/button';
import { AddProjectCard } from '@/features/projects/components/AddProjectCard';
import { ConnectConsentDialog } from '@/features/projects/components/ConnectConsentDialog';
import { ConnectingOverlay } from '@/features/projects/components/ConnectingOverlay';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { useConnectProject, useProjects } from '@/hooks/queries/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleAccountConnect } from '@/hooks/useGoogleAccountConnect';
import { USE_MOCKS } from '@/lib/mockDelay';
import type { Project } from '@/types/project';

export function ProjectsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const connectMutation = useConnectProject();

  const [connectTarget, setConnectTarget] = useState<Project | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { connect: connectGoogleAccount, isConnecting: isConnectingGoogleAccount } =
    useGoogleAccountConnect({
      onSuccess: () => {
        toast.success('Google account connected.');
        refetch();
      },
      onError: (message) => toast.error(message),
    });

  const connectedCount = useMemo(
    () => projects?.filter((p) => p.connected).length ?? 0,
    [projects]
  );
  const isAdmin = user?.roleName === 'Admin';
  const settingsTargetProjectId = projects?.[0]?.id;

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleAddProperty = () => {
    if (USE_MOCKS) {
      toast.info('Adding new properties is coming soon.');
      return;
    }
    connectGoogleAccount();
  };

  const handleAllowConnect = () => {
    if (!connectTarget) return;
    setIsConnecting(true);
    connectMutation.mutate(connectTarget.id, {
      onSuccess: (project) => navigate(`/app/${project.id}/dashboard`),
      onSettled: () => {
        setIsConnecting(false);
        setConnectTarget(null);
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-16 items-center justify-between border-b border-border bg-card px-7 shadow-[0_1px_2px_rgba(14,23,38,0.04)]">
        <Logo iconSize={36} />
        <div className="flex items-center gap-3.5">
          {isAdmin ? (
            <Link
              to="/admin/user-monitoring"
              title="User Monitoring"
              className="flex items-center justify-center rounded-[10px] border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Activity className="size-[15px]" />
            </Link>
          ) : null}
          {isAdmin && settingsTargetProjectId ? (
            <Link
              to={`/app/${settingsTargetProjectId}/settings`}
              title="Settings"
              className="flex items-center justify-center rounded-[10px] border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="size-[15px]" />
            </Link>
          ) : null}
          <span className="text-[13px] text-muted-foreground">{user?.fullName}</span>
          <span className="flex size-[34px] items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {user?.fullName?.charAt(0) ?? '?'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-primary/30 text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            Sign out
          </Button>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight">Your Projects</h1>
          <p className="text-[15px] text-muted-foreground">
            {connectedCount} of {projects?.length ?? 0} properties connected from your Google Search
            Console account.
          </p>
        </div>

        {isLoading ? <PageLoader label="Loading your projects…" /> : null}
        {isError ? (
          <QueryErrorFallback message="We couldn't load your projects." onRetry={() => refetch()} />
        ) : null}
        {projects ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onConnect={setConnectTarget} />
            ))}
            <AddProjectCard onClick={handleAddProperty} isConnecting={isConnectingGoogleAccount} />
          </div>
        ) : null}
      </div>

      <ConnectConsentDialog
        project={isConnecting ? null : connectTarget}
        onCancel={() => setConnectTarget(null)}
        onAllow={handleAllowConnect}
      />
      {isConnecting && connectTarget ? (
        <ConnectingOverlay projectName={connectTarget.name} />
      ) : null}
    </div>
  );
}
