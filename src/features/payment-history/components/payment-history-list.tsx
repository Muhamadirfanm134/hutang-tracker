"use client";

import { cn, formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import {
  getPaymentTypeLabel,
  PAYMENT_TYPE_COLORS,
  PAYMENT_TYPE_EMOJI,
  PAYMENT_TYPE_TABS,
} from "../constants";
import { usePaymentHistory } from "../hooks/use-payment-history";
import Link from "next/link";
import { PaymentTypeType } from "../schema";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronRight, Hash, Wallet } from "lucide-react";
import MobileHeader from "@/components/(design-systems)/mobileHeader";

/**
 * Summary card showing totals for the active debt type
 */
function PaymentSummaryCard({
  totalAmount,
  totalPayments,
  type,
}: {
  totalAmount: number;
  totalPayments: number;
  type: PaymentTypeType;
}) {
  const colors = PAYMENT_TYPE_COLORS[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br p-5",
        colors.gradient
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative z-10">
        <p className="text-sm font-medium text-white/80">Total Dibayar</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-white">
          {formatRupiah(totalAmount)}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
            <Hash className="h-3.5 w-3.5 text-white/80" />
            <span className="text-xs font-medium text-white">
              {totalPayments} Pembayaran
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Individual payment card
 */
function PaymentCard({
  item,
  index,
}: {
  item: {
    id: string;
    created_at: string;
    type: PaymentTypeType;
    amount: number;
    pembayaran_ke: number;
    note?: string | null;
  };
  index: number;
}) {
  const colors = PAYMENT_TYPE_COLORS[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/history/${item.id}`}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5",
            colors.border
          )}
        >
          <div className="flex items-center gap-3.5">
            {/* Cicilan Badge */}
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl",
                colors.light
              )}
            >
              <span className="text-[10px] font-medium text-gray-500">ke</span>
              <span className={cn("text-lg font-bold leading-none", colors.text)}>
                {item.pembayaran_ke}
              </span>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {dayjs(item.created_at).format("ddd, DD MMM YYYY")}
                </span>
              </div>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatRupiah(item.amount)}
              </p>
              {item.note && (
                <p className="mt-0.5 truncate text-xs text-gray-400">{item.note}</p>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gray-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Empty state
 */
function EmptyState({ type }: { type: PaymentTypeType }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <Wallet className="h-8 w-8 text-gray-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">Belum ada riwayat</p>
      <p className="mt-1 text-xs text-gray-400">
        Pembayaran {getPaymentTypeLabel(type)} akan muncul di sini
      </p>
    </motion.div>
  );
}

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded-full bg-gray-100" />
              <div className="h-5 w-24 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentHistoryList() {
  const {
    activeType,
    setActiveType,
    paymentsByType,
    isLoadingByType,
  } = usePaymentHistory();

  const totalAmount =
    paymentsByType?.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const totalPayments = paymentsByType?.length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <MobileHeader title="Riwayat Pembayaran" />

      <div className="space-y-4 px-4 pt-20 pb-28">
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PAYMENT_TYPE_TABS.map((type) => {
            const isActive = activeType === type;
            const colors = PAYMENT_TYPE_COLORS[type];

            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300",
                  isActive
                    ? cn(colors.activeBg, colors.activeText, "shadow-md")
                    : cn(
                        "border bg-white text-gray-500 hover:bg-gray-50",
                        colors.border
                      )
                )}
              >
                <span className="text-sm">{PAYMENT_TYPE_EMOJI[type]}</span>
                <span>{getPaymentTypeLabel(type)}</span>
              </button>
            );
          })}
        </div>

        {/* Content (animated) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Summary Card */}
            {!isLoadingByType && totalPayments > 0 && (
              <PaymentSummaryCard
                totalAmount={totalAmount}
                totalPayments={totalPayments}
                type={activeType}
              />
            )}

            {/* List */}
            {isLoadingByType ? (
              <LoadingSkeleton />
            ) : paymentsByType && paymentsByType.length > 0 ? (
              <div className="space-y-3">
                {paymentsByType.map((item, index) => (
                  <PaymentCard key={item.id} item={item} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState type={activeType} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
