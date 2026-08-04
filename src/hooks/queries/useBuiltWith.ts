import { useMutation } from "@tanstack/react-query";
import { runBuiltWith } from "@/services/builtWith.service";

export function useBuiltWith() {
  return useMutation({
    mutationFn: (url: string) => runBuiltWith(url),
  });
}
