"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPaymentHistory,
  updatePayment,
} from "../api/payment-history-fetcher";
import { CreatePaymentInput, Payment, UpdatePaymentInput } from "../schema";

/**
 * Centralized Query Keys
 */
const paymentKeys = {
  all: ["payment"] as const,
  list: ["payment", "list"] as const,
  detail: (id: string) => ["payment", "detail", id] as const,
};

export function usePaymentHistory() {
  const queryClient = useQueryClient();

  /**
   * ======================
   * GET ALL
   * ======================
   */
  const listQuery = useQuery({
    queryKey: paymentKeys.list,
    queryFn: getPaymentHistory,
    staleTime: 1000 * 60, // 1 minute
  });

  /**
   * ======================
   * GET DETAIL
   * ======================
   */
  const getDetail = (id: string) =>
    useQuery({
      queryKey: paymentKeys.detail(id),
      queryFn: () => getPaymentById(id),
      enabled: !!id,
    });

  /**
   * ======================
   * CREATE
   * ======================
   */
  const createMutation = useMutation({
    mutationFn: (payload: CreatePaymentInput) => createPayment(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list });
    },
  });

  /**
   * ======================
   * UPDATE
   * ======================
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentInput }) =>
      updatePayment(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(variables.id),
      });
    },
  });

  /**
   * ======================
   * DELETE
   * ======================
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePayment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list });
    },
  });

  return {
    /**
     * Queries
     */
    payments: listQuery.data as Payment[] | undefined,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,

    getDetail,

    /**
     * Mutations
     */
    createPayment: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updatePayment: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deletePayment: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
