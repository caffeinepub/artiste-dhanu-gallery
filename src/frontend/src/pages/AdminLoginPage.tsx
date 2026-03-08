import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

interface AdminLoginPageProps {
  navigate: (p: AppPage) => void;
}

export default function AdminLoginPage({ navigate }: AdminLoginPageProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  // Redirect admin to dashboard once confirmed
  useEffect(() => {
    if (isAdmin === true) {
      navigate({ name: "adminDashboard" });
    } else if (isAdmin === false && isLoggedIn) {
      toast.error("You do not have admin access.");
      clear();
    }
  }, [isAdmin, isLoggedIn, navigate, clear]);

  if (isInitializing) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex items-center justify-center min-h-96"
      >
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <div
      data-ocid="admin.login.page"
      className="container max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 shadow-craft">
          <Shield className="text-primary" size={32} />
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Admin Access
        </h1>
        <div className="divider-ornament max-w-xs mx-auto mb-4">
          <span className="font-serif italic text-sm text-muted-foreground">
            ✦ authorized personnel only ✦
          </span>
        </div>
        <p className="font-serif text-muted-foreground mb-8 text-lg">
          Sign in to manage products and orders for Artiste Dhanu Gallery.
        </p>

        {!isLoggedIn ? (
          <Button
            data-ocid="admin.login.primary_button"
            size="lg"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full font-sans font-semibold text-base flex items-center gap-2 py-6 shadow-craft"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </Button>
        ) : (
          <div
            data-ocid="admin.checking.loading_state"
            className="flex flex-col items-center gap-3"
          >
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="font-sans text-sm text-muted-foreground">
              {checkingAdmin ? "Checking admin access…" : "Redirecting…"}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6 font-sans">
          Only authorized administrators can access this area.
        </p>
      </motion.div>
    </div>
  );
}
