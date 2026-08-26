import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Logo } from "@/components/common/Logo";
import { PageLoader } from "@/components/common/PageLoader";
import { QueryErrorFallback } from "@/components/common/QueryErrorFallback";
import { Button } from "@/components/ui/button";
import { ErrorLogTable } from "@/features/user-monitoring/components/ErrorLogTable";
import { SummaryCards } from "@/features/user-monitoring/components/SummaryCards";
import { UsageOverTimeChart } from "@/features/user-monitoring/components/UsageOverTimeChart";
import { UserActivityTable } from "@/features/user-monitoring/components/UserActivityTable";
import { useActivityErrors, useActivityLogs, useActivitySummary } from "@/hooks/queries/useActivity";
import { useAuth } from "@/hooks/useAuth";

/** Top-level admin page — not project-scoped, so it gets its own header instead of the project Sidebar/Topbar. */
export function UserMonitoringPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const summaryQuery = useActivitySummary();
  const logsQuery = useActivityLogs({ limit: 500 });
  const errorsQuery = useActivityErrors(50);

  const isLoading = summaryQuery.isLoading || logsQuery.isLoading || errorsQuery.isLoading;
  const isError = summaryQuery.isError || logsQuery.isError || errorsQuery.isError;

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-16 items-center justify-between border-b border-border bg-card px-7 shadow-[0_1px_2px_rgba(14,23,38,0.04)]">
        <div className="flex items-center gap-4">
          <Logo iconSize={36} />
          <Link
            to="/projects"
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-[15px]" />
            Projects
          </Link>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="text-[13px] text-muted-foreground">{user?.fullName}</span>
          <span className="flex size-[34px] items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {user?.fullName?.charAt(0) ?? "?"}
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

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-8">
        <div>
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight">User Monitoring</h1>
          <p className="text-[15px] text-muted-foreground">
            How people are actually using the platform — activity, engagement and errors, at a glance.
          </p>
        </div>

        {isLoading ? <PageLoader label="Loading user activity…" /> : null}

        {isError || (!isLoading && (!summaryQuery.data || !logsQuery.data || !errorsQuery.data)) ? (
          <QueryErrorFallback
            message="We couldn't load user monitoring data."
            onRetry={() => {
              summaryQuery.refetch();
              logsQuery.refetch();
              errorsQuery.refetch();
            }}
          />
        ) : null}

        {summaryQuery.data && logsQuery.data && errorsQuery.data ? (
          <>
            <SummaryCards summaries={summaryQuery.data} errors={errorsQuery.data} />

            <UsageOverTimeChart logs={logsQuery.data.items} />

            <div>
              <h2 className="mb-3 text-lg font-bold text-foreground">Activity by user</h2>
              <UserActivityTable summaries={summaryQuery.data} />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-bold text-foreground">Recent errors</h2>
              <ErrorLogTable errors={errorsQuery.data} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
