"use client";

import { useParams, useRouter } from "next/navigation";
import { usePaymentHistory, usePaymentDetail } from "../hooks/use-payment-history";
import {
  getPaymentTypeLabel,
  PAYMENT_TYPE_COLORS,
  PAYMENT_TYPE_EMOJI,
} from "../constants";

import dayjs from "dayjs";
import { DetailItem } from "@/components/(design-systems)/detailItem/detail-item";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import MobileHeader from "@/components/(design-systems)/mobileHeader";
import {
  Calendar,
  FileText,
  Hash,
  ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";
import { PaymentTypeType } from "../schema";
import { SupabaseImage } from "@/components/(design-systems)/supabaseImage";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import toast from "@/hooks/useToast";

const BUCKET = "payment_attachment";

/**
 * Fullscreen image viewer overlay
 */
function ImageViewer({
  path,
  onClose,
}: {
  path: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative max-h-[85vh] max-w-full overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <SupabaseImage
          bucket={BUCKET}
          path={path}
          width={600}
          height={800}
          alt="Bukti pembayaran"
          className="h-auto max-h-[85vh] w-auto rounded-2xl object-contain"
          />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-sm text-white transition hover:bg-black/70"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Loading skeleton for detail page
 */
function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse rounded-3xl bg-gray-100 p-5">
        <div className="h-4 w-24 rounded-full bg-gray-200" />
        <div className="mt-2 h-8 w-40 rounded-full bg-gray-200" />
        <div className="mt-4 h-8 w-32 rounded-full bg-gray-200" />
      </div>
      <div className="animate-pulse space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-28 rounded-full bg-gray-100" />
            <div className="h-4 w-36 rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentHistoryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [viewerPath, setViewerPath] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { debts, payments, deleteAsync, isDeleting } = usePaymentHistory();

  const { data, isLoading, isError } = usePaymentDetail(id);

  const handleDelete = async () => {
    if (!data || !isAdmin || isDeleting) return;

    const confirmed = window.confirm(
      "Hapus pembayaran ini? Data yang sudah dihapus tidak bisa dikembalikan."
    );
    if (!confirmed) return;

    try {
      await deleteAsync(data.id);
      toast({
        title: "Pembayaran berhasil dihapus",
        variant: "success",
        position: "top-center",
      });
      router.replace("/history");
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Gagal menghapus pembayaran",
        variant: "error",
        position: "top-center",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Detail Pembayaran" />
        <div className="px-4 pt-20 pb-28">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Detail Pembayaran" />
        <div className="flex flex-col items-center justify-center px-4 pt-32">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FileText className="h-7 w-7 text-red-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Gagal memuat data
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Detail Pembayaran" />
        <div className="flex flex-col items-center justify-center px-4 pt-32">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-7 w-7 text-gray-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Data tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  const matchingDebt = debts?.find((d) => d.payment_type_code === data.type);
  const totalHutang = matchingDebt?.total_hutang || 0;
  const relatedPayments = payments?.filter(
    (p) => p.type === data.type && new Date(p.created_at) <= new Date(data.created_at)
  ) || [];
  const totalPaidUpToThis = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
  const calculatedRemaining = Math.max(0, totalHutang - totalPaidUpToThis);
  const finalRemainingDebt = data.sisa_pembayaran ?? calculatedRemaining;

  const colors = PAYMENT_TYPE_COLORS[data.type as PaymentTypeType];
  const emoji = PAYMENT_TYPE_EMOJI[data.type as PaymentTypeType];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <MobileHeader title="Detail Pembayaran" />

      {/* Fullscreen Image Viewer */}
      {viewerPath && (
        <ImageViewer path={viewerPath} onClose={() => setViewerPath(null)} />
      )}

      <div className="space-y-4 px-4 pt-20 pb-28">
        {/* Hero Card */}
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
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Total Dibayar</p>
              <h2 className="mt-1 text-3xl font-bold text-white">
                {formatRupiah(data.amount)}
              </h2>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span>{emoji}</span>
                <span>{getPaymentTypeLabel(data.type).replace("Hutang ", "")}</span>
              </div>
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/pay/${data.id}`)}
                  disabled={isDeleting}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Edit pembayaran"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500/80 text-white backdrop-blur-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Hapus pembayaran"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="space-y-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Informasi Pembayaran
          </h3>

          <DetailItem
            label={
              <span className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Tanggal
              </span>
            }
            value={dayjs(data.created_at).format("DD MMMM YYYY")}
          />

          <div className="my-2 border-t border-dashed border-gray-100" />

          <DetailItem
            label={
              <span className="flex items-center gap-2 text-sm">
                <Wallet className="h-3.5 w-3.5" />
                Jumlah
              </span>
            }
            value={formatRupiah(data.amount)}
            valueClassName="font-bold text-gray-900"
          />

          <div className="my-2 border-t border-dashed border-gray-100" />

          <DetailItem
            label={
              <span className="flex items-center gap-2 text-sm">
                <Hash className="h-3.5 w-3.5" />
                Cicilan ke-
              </span>
            }
            value={data.pembayaran_ke}
          />

          <div className="my-2 border-t border-dashed border-gray-100" />

          <DetailItem
            label={
              <span className="flex items-center gap-2 text-sm text-orange-600">
                <Wallet className="h-3.5 w-3.5" />
                Sisa Hutang
              </span>
            }
            value={formatRupiah(finalRemainingDebt)}
            valueClassName="font-bold text-orange-600"
          />

          {data.note && (
            <>
              <div className="my-2 border-t border-dashed border-gray-100" />
              <DetailItem
                label={
                  <span className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    Keterangan
                  </span>
                }
                value={data.note}
              />
            </>
          )}
        </motion.div>

        {/* Attachments as Images */}
        {data.payment_attachment && data.payment_attachment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ImageIcon className="h-4 w-4" />
              Bukti Pembayaran ({data.payment_attachment.length})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {data.payment_attachment.map((path, i) => {
                const fullPath = path.includes("/") ? path : `${data.debt_id}/${path}`;
                return (
                  <button
                    key={i}
                    onClick={() => setViewerPath(fullPath)}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md",
                      colors.border
                    )}
                  >
                    <div className="aspect-square w-full">
                      <SupabaseImage
                        bucket={BUCKET}
                        path={fullPath}
                        width={300}
                        height={300}
                        alt={`Bukti pembayaran ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Tap untuk memperbesar
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
