"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn, formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePaymentHistory } from "../hooks/use-payment-history";
import {
  PAYMENT_TYPE_COLORS,
  PAYMENT_TYPE_EMOJI,
} from "../constants";
import { Payment, PaymentTypeType } from "../schema";
import MobileHeader from "@/components/(design-systems)/mobileHeader";
import {
  Wallet,
  FileText,
  Hash,
  CheckCircle2,
  Loader2,
  ImagePlus,
  X,
  Upload,
  CalendarDays,
} from "lucide-react";
import dayjs from "dayjs";
import toast from "@/hooks/useToast";
import { useUploader } from "@/hooks/useUploader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { SupabaseImage } from "@/components/(design-systems)/supabaseImage";

const BUCKET = "payment_attachment";

type PayFormProps = {
  payment?: Payment;
};

export function PayForm({ payment }: PayFormProps) {
  const router = useRouter();
  const {
    createPayment,
    isCreating,
    updateAsync,
    isUpdating,
    debts,
    isLoadingDebts,
    payments,
  } = usePaymentHistory();
  const { uploadFile, uploading, progress } = useUploader(BUCKET);
  const isEdit = !!payment;

  const [selectedType, setSelectedType] = useState<PaymentTypeType>(
    payment?.type ?? "HUTANG_MOBIL"
  );
  const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
  const [pembayaranKe, setPembayaranKe] = useState(
    payment ? String(payment.pembayaran_ke) : ""
  );
  const [note, setNote] = useState(payment?.note ?? "");
  const [createdAt, setCreatedAt] = useState<Date | undefined>(
    payment ? dayjs(payment.created_at).toDate() : new Date()
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<string[]>(
    payment?.payment_attachment ?? []
  );

  // Attachment state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const matchingDebt = debts?.find((d) => d.payment_type_code === selectedType);
  const debtId = matchingDebt?.id || "";

  // Auto-increment pembayaran_ke based on latest payment of this type
  const nextPembayaranKe = useMemo(() => {
    if (!payments || payments.length === 0) return 1;
    const typePayments = payments.filter((p) => p.type === selectedType);
    if (typePayments.length === 0) return 1;
    const maxKe = Math.max(...typePayments.map((p) => p.pembayaran_ke));
    return maxKe + 1;
  }, [payments, selectedType]);

  const numericAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const effectivePembayaranKe = pembayaranKe || String(nextPembayaranKe);

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setAmount(digits);
  };

  const isValid =
    numericAmount > 0 && parseInt(effectivePembayaranKe) > 0 && debtId.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Append to existing files
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isValid || isCreating || isUpdating || isUploading) return;

    let attachmentPaths: string[] = [];

    // Upload files if any
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = selectedFiles.map(async (file) => {
          // Get extension
          const parts = file.name.split(/\.(?=[^\.]+$)/);
          const rawName = parts[0];
          const ext = parts.length > 1 ? parts[1] : "";

          // Clean name
          const cleaned = rawName
            .replace(/^\d+\.\s*/, "") // Remove leading number + dot (if any)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]/g, "");

          const timestamp = Date.now();
          const newName = ext ? `${cleaned}-${timestamp}.${ext}` : `${cleaned}-${timestamp}`;
          
          const filePath = `${debtId}/${newName}`;

          // Use raw supabase upload via the hook (which handles signed URL)
          const result = await uploadFile(file, filePath);
          if (!result) throw new Error(`Failed to upload ${file.name}`);

          // The uploadFile returns the path without folder prefix
          // We need to return the full path with debt_id
          return result;
        });

        const results = await Promise.all(uploadPromises);
        attachmentPaths = results.filter(Boolean) as string[];
      } catch {
        toast({
          title: "Gagal mengupload bukti pembayaran",
          variant: "error",
          position: "top-center",
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const paymentAttachment = [...existingAttachments, ...attachmentPaths];
    const payload = {
      debt_id: debtId,
      type: selectedType,
      amount: numericAmount,
      pembayaran_ke: parseInt(effectivePembayaranKe),
      note: note.trim() || undefined,
      created_at: dayjs(createdAt).toISOString(),
      payment_attachment:
        paymentAttachment.length > 0 ? paymentAttachment : undefined,
    };

    if (isEdit) {
      try {
        await updateAsync({
          id: payment.id,
          payload: {
            ...payload,
            note: note.trim() || null,
            payment_attachment: paymentAttachment,
          },
        });
        setIsSuccess(true);
        toast({
          title: "Pembayaran berhasil diupdate",
          variant: "success",
          position: "top-center",
        });
        setTimeout(() => {
          router.push(`/history/${payment.id}`);
        }, 1200);
      } catch (err) {
        toast({
          title: err instanceof Error ? err.message : "Gagal mengupdate pembayaran",
          variant: "error",
          position: "top-center",
        });
      }
      return;
    }

    createPayment(
      payload,
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast({
            title: "Pembayaran berhasil dicatat! ✅",
            variant: "success",
            position: "top-center",
          });
          setTimeout(() => {
            router.push("/history");
          }, 1500);
        },
        onError: (err) => {
          toast({
            title: err.message || "Gagal mencatat pembayaran",
            variant: "error",
            position: "top-center",
          });
        },
      }
    );
  };

  const colors = PAYMENT_TYPE_COLORS[selectedType] || { gradient: "from-gray-400 to-gray-500", activeBg: "bg-gray-600", activeText: "text-white" };
  const isBusy = isCreating || isUpdating || isUploading;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <MobileHeader title={isEdit ? "Edit Pembayaran" : "Catat Pembayaran"} />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-4 pt-40"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br",
                colors.gradient
              )}
            >
              <CheckCircle2 className="h-12 w-12 text-white" />
            </motion.div>
            <p className="mt-6 text-xl font-bold text-gray-900">Berhasil!</p>
            <p className="mt-1 text-sm text-gray-500">
              Pembayaran {formatRupiah(numericAmount)}{" "}
              {isEdit ? "diupdate" : "tercatat"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 px-4 pt-20 pb-28"
          >
            {/* Amount Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-center",
                colors.gradient
              )}
            >
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />

              <div className="relative z-10">
                <p className="text-sm font-medium text-white/80">Jumlah Pembayaran</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-white">
                  {numericAmount > 0 ? formatRupiah(numericAmount) : "Rp 0"}
                </p>
              </div>
            </motion.div>

            {/* Debt Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <label className="mb-3 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tipe Hutang
              </label>
              <div className="flex gap-2">
                {(debts || []).map((debt) => {
                  const type = debt.payment_type_code;
                  const isActive = selectedType === type;
                  const c = PAYMENT_TYPE_COLORS[type] || { activeBg: "bg-gray-600", activeText: "text-white" };

                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        if (!isEdit) setPembayaranKe("");
                      }}
                      className={cn(
                        "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all duration-300",
                        isActive
                          ? cn(c.activeBg, c.activeText, "border-transparent shadow-md")
                          : cn("border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100")
                      )}
                    >
                      <span className="text-lg">{PAYMENT_TYPE_EMOJI[type] || "💰"}</span>
                      <span className="text-[10px] font-semibold leading-tight text-center">
                        {debt.description.replace("Hutang ", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Active Debt Information */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Informasi Hutang
              </label>
              {isLoadingDebts ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  Memuat data hutang...
                </div>
              ) : matchingDebt ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-gray-900">{matchingDebt.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Total Hutang:</span>
                    <span className="font-semibold text-gray-700">{formatRupiah(matchingDebt.total_hutang)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>ID:</span>
                    <span>{matchingDebt.id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500">Data hutang tidak ditemukan untuk tipe ini.</p>
              )}
            </motion.div>

            {/* Form Fields */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Amount */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Wallet className="h-3.5 w-3.5" />
                  Jumlah (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount ? parseInt(amount).toLocaleString("id-ID") : ""}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-bold text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Pembayaran ke- */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Hash className="h-3.5 w-3.5" />
                  Pembayaran ke-
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={effectivePembayaranKe}
                  onChange={(e) => setPembayaranKe(e.target.value)}
                  placeholder="1"
                  min={1}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Created At */}
              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Tanggal Pembayaran
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-left text-sm font-normal text-gray-900 transition-all hover:bg-white hover:border-gray-300",
                        !createdAt && "text-muted-foreground"
                      )}
                    >
                      {createdAt ? dayjs(createdAt).format("DD MMMM YYYY") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={createdAt}
                      onSelect={setCreatedAt}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <FileText className="h-3.5 w-3.5" />
                  Catatan (opsional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tambahkan catatan..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </motion.div>

            {/* Attachment Uploader */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <label className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <ImagePlus className="h-3.5 w-3.5" />
                Bukti Pembayaran (opsional)
              </label>

              {/* Upload trigger area */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-all duration-200",
                  "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-500"
                )}
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm font-medium">Pilih atau ambil foto</span>
              </button>

              {/* Upload progress */}
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Mengupload... {progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", colors.gradient)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {existingAttachments.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {existingAttachments.map((path, i) => {
                    const fullPath = path.includes("/")
                      ? path
                      : `${payment?.debt_id ?? debtId}/${path}`;

                    return (
                      <div
                        key={`${path}-${i}`}
                        className="group relative overflow-hidden rounded-xl border border-gray-200"
                      >
                        <SupabaseImage
                          bucket={BUCKET}
                          path={fullPath}
                          width={180}
                          height={180}
                          alt={`Bukti pembayaran ${i + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingAttachment(i)}
                          className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Preview thumbnails */}
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!isValid || isBusy}
                className={cn(
                  "w-full cursor-pointer rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all duration-300",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isValid
                    ? cn("bg-gradient-to-r", colors.gradient, "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0")
                    : "bg-gray-300"
                )}
              >
                {isBusy ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isUploading ? "Mengupload bukti..." : "Menyimpan..."}
                  </span>
                ) : (
                  isEdit ? "Update Pembayaran" : "Simpan Pembayaran"
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
