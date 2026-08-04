import { useMutation } from "@tanstack/react-query";
import { checkCoreWebVitals } from "@/services/coreWebVitals.service";

export function useCoreWebVitals() {
  return useMutation({
    mutationFn: (url: string) => checkCoreWebVitals(url),
  });
}
