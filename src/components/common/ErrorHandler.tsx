import { useEffect } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import posthog from "@/lib/posthog";
import { axiosInstance } from "@/services/http.service";

interface ApiErrorBody {
  message?: string;
}

/**
 * Registers axios response interceptors for the lifetime of the app (mirrors
 * the `mmscan` frontend's `ErrorHandler` component). Toasts non-GET success
 * messages and every failure, and signs the user out only on 401. Rendered
 * once near the app root, alongside `<ToastContainer/>`.
 */
export function ErrorHandler() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleSuccess = (response: AxiosResponse<ApiErrorBody>) => {
      const { data, config } = response;
      if (data?.message && config.method !== "get") {
        toast.success(data.message);
      }
      return response;
    };

    const handleError = (error: AxiosError<ApiErrorBody>) => {
      const { response } = error;
      const message = response?.data?.message ?? error.message ?? "Something went wrong. Please try again.";

      // Only a 401 means the session is invalid. A 403 can be raised for an
      // unrelated reason (e.g. an expired Google Search Console grant), so it
      // must not eject an otherwise valid session.
      if (response?.status === 401) {
        signOut();
        navigate("/login");
      }

      // A stable `toastId` collapses repeats of the same failure — parallel
      // queries, the react-query retry, and a shared endpoint would otherwise
      // stack several identical toasts.
      toast.error(message, { toastId: message });
      posthog.captureException(error);

      return Promise.reject(error);
    };

    const interceptorId = axiosInstance.interceptors.response.use(handleSuccess, handleError);
    return () => axiosInstance.interceptors.response.eject(interceptorId);
  }, [navigate, signOut]);

  return null;
}
