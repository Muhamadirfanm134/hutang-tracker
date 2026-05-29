"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPaymentHistory,
  getPaymentHistoryByType,
  updatePayment,
  getDebts,
  Debt,
} from "../api/payment-history-fetcher";
import { CreatePaymentInput, Payment, PaymentTypeType, UpdatePaymentInput } from "../schema";
import { useState } from "react";

/**
 * Centralized Query Keys
 */
const paymentKeys = {
  all: ["payment"] as const,
  list: ["payment", "list"] as const,
  listByType: (type: PaymentTypeType) => ["payment", "list", type] as const,
  detail: (id: string) => ["payment", "detail", id] as const,
  debts: ["debts"] as const,
};

export function usePaymentHistory() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<PaymentTypeType>("HUTANG_MOBIL");

  /**
   * ======================
   * GET DEBTS
   * ======================
   */
  const debtsQuery = useQuery({
    queryKey: paymentKeys.debts,
    queryFn: getDebts,
  });

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
   * GET BY TYPE (for tab filtering)
   * ======================
   */
  const listByTypeQuery = useQuery({
    queryKey: paymentKeys.listByType(activeType),
    queryFn: () => getPaymentHistoryByType(activeType),
    staleTime: 1000 * 60,
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
      queryClient.invalidateQueries({ queryKey: paymentKeys.listByType(activeType) });
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
      queryClient.invalidateQueries({ queryKey: paymentKeys.listByType(activeType) });
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
      queryClient.invalidateQueries({ queryKey: paymentKeys.listByType(activeType) });
    },
  });

  return {
    /**
     * Active Type (Tab)
     */
    activeType,
    setActiveType,

    /**
     * Queries
     */
    payments: listQuery.data as Payment[] | undefined,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,

    paymentsByType: listByTypeQuery.data as Payment[] | undefined,
    isLoadingByType: listByTypeQuery.isLoading,
    isFetchingByType: listByTypeQuery.isFetching,

    debts: debtsQuery.data,
    isLoadingDebts: debtsQuery.isLoading,

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
