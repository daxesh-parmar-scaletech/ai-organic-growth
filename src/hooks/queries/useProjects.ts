import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { connectProject, getProjects } from "@/services/projects.service";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: getProjects,
  });
}

export function useConnectProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectProject,
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.projects(), (previous: Awaited<ReturnType<typeof getProjects>> | undefined) =>
        previous?.map((p) => (p.id === project.id ? project : p)),
      );
      queryClient.setQueryData(queryKeys.project(project.id), project);
    },
  });
}
