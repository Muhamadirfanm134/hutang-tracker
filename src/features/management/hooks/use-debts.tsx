import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDebts, createDebt, updateDebt, deleteDebt, CreateDebtInput, UpdateDebtInput } from "../api/debts-fetcher";

const keys = {
  all: ["debts", "management"] as const,
};

export function useDebts() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: keys.all,
    queryFn: getDebts,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateDebtInput) => createDebt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      queryClient.invalidateQueries({ queryKey: ["debts"] }); // invalidate global debts key
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDebtInput }) => updateDebt(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });

  return {
    debts: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    createDebt: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateDebt: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteDebt: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
