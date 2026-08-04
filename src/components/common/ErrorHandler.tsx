import { useEffect } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { axiosInstance } from "@/services/http.service";

interface ApiErrorBody {
  message?: string;
}

/**
 * Registers axios response interceptors for the lifetime of the app (mirrors
 * the `mmscan` frontend's `ErrorHandler` component). Toasts non-GET success
 * messages and every failure, and signs the user out on 401/403. Rendered
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

      if (response?.status === 401 || response?.status === 403) {
        signOut();
        navigate("/login");
      }
      toast.error(message);

      return Promise.reject(error);
    };

    const interceptorId = axiosInstance.interceptors.response.use(handleSuccess, handleError);
    return () => axiosInstance.interceptors.response.eject(interceptorId);
  }, [navigate, signOut]);

  return null;
}
