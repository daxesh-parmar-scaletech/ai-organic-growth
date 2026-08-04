import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {user?.name?.charAt(0) ?? "?"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold">{user?.name}</span>
          <span className="block truncate text-[11.5px] text-muted-foreground">Owner</span>
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
