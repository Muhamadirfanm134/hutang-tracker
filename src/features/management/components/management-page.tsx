"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { useDebts } from "../hooks/use-debts";
import { CreateDebtInput } from "../api/debts-fetcher";
import { Debt } from "@/features/payment-history/api/payment-history-fetcher";
import { Plus, Edit2, Trash2, Loader2, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";
import MobileHeader from "@/components/(design-systems)/mobileHeader";
import toast from "@/hooks/useToast";

const PAYMENT_MODE_OPTIONS = [
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "INSTALLMENT", label: "Installment" },
];

function FieldWrapper({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200";

export function ManagementPage() {
  const { debts, isLoading, createDebt, isCreating, updateDebt, isUpdating, deleteDebt, isDeleting } = useDebts();
  const isSaving = isCreating || isUpdating;
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CreateDebtInput>({
    defaultValues: {
      description: "",
      payment_mode: "FLEXIBLE",
      payment_type_code: "",
      total_hutang: 0,
      total_tenor: null,
      due_date: null,
    },
  });

  const openCreate = () => {
    setEditingDebt(null);
    reset({
      description: "",
      payment_mode: "FLEXIBLE",
      payment_type_code: "",
      total_hutang: 0,
      total_tenor: null,
      due_date: null,
    });
    setShowForm(true);
  };

  const openEdit = (debt: Debt) => {
    setEditingDebt(debt);
    reset({
      description: debt.description,
      payment_mode: debt.payment_mode,
      payment_type_code: debt.payment_type_code,
      total_hutang: debt.total_hutang,
      total_tenor: debt.total_tenor ?? null,
      due_date: debt.due_date ?? null,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDebt(null);
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: CreateDebtInput = {
        ...data,
        total_tenor: data.total_tenor || null,
        due_date: data.due_date || null,
      };
      if (editingDebt) {
        await updateDebt({ id: editingDebt.id, payload });
        toast({ title: "Data hutang berhasil diubah ✅", variant: "success", position: "top-center" });
      } else {
        await createDebt(payload);
        toast({ title: "Tipe hutang berhasil ditambahkan ✅", variant: "success", position: "top-center" });
      }
      closeForm();
    } catch {
      toast({ title: "Gagal menyimpan data", variant: "error", position: "top-center" });
    }
  });

  const onDelete = async (id: string) => {
    if (!confirm("Hapus data hutang ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setDeletingId(id);
    try {
      await deleteDebt(id);
      toast({ title: "Data hutang berhasil dihapus", variant: "success", position: "top-center" });
    } catch {
      toast({ title: "Gagal menghapus data", variant: "error", position: "top-center" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <MobileHeader
        title="Management Hutang"
        action={
          !showForm ? (
            <button onClick={openCreate} className="cursor-pointer">
              <Plus className="h-5 w-5 text-gray-700" />
            </button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {/* ── FORM VIEW ─────────────────────────────── */}
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
          <form onSubmit={onSubmit} className="space-y-4 px-4 pt-20 pb-28">
            {/* Header card with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-6 text-center"
            >
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
              <div className="relative z-10">
                <p className="text-sm font-medium text-white/70">
                  {editingDebt ? "Edit Data Hutang" : "Tambah Tipe Hutang"}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {editingDebt ? editingDebt.description : "Baru"}
                </p>
              </div>
            </motion.div>

            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <FieldWrapper label="Deskripsi" required>
                <input
                  {...register("description", { required: "Wajib diisi" })}
                  placeholder="Contoh: Hutang Mobil"
                  className={inputClass}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </FieldWrapper>

              <FieldWrapper label="Kode Tipe (Unik)" required>
                <input
                  {...register("payment_type_code", { required: "Wajib diisi" })}
                  placeholder="Contoh: HUTANG_MOBIL"
                  className={inputClass}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.payment_type_code && (
                  <p className="text-xs text-red-500">{errors.payment_type_code.message}</p>
                )}
              </FieldWrapper>

              <FieldWrapper label="Mode Pembayaran" required>
                <Controller
                  name="payment_mode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:bg-white">
                        <SelectValue placeholder="Pilih mode pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_MODE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldWrapper>

              <FieldWrapper label="Total Hutang" required>
                <input
                  type="number"
                  {...register("total_hutang", { valueAsNumber: true, required: "Wajib diisi", min: { value: 1, message: "Harus lebih dari 0" } })}
                  placeholder="0"
                  className={inputClass}
                />
                {errors.total_hutang && (
                  <p className="text-xs text-red-500">{errors.total_hutang.message}</p>
                )}
              </FieldWrapper>

              <FieldWrapper label="Total Tenor (Bulan)">
                <input
                  type="number"
                  {...register("total_tenor", {
                    setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? null : Number(v)),
                  })}
                  placeholder="Kosongkan jika tidak ada"
                  className={inputClass}
                />
              </FieldWrapper>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-3"
            >
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-2xl text-sm font-semibold"
                onClick={closeForm}
                disabled={isSaving}
              >
                Batal
              </Button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-900 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Simpan
                  </>
                )}
              </button>
            </motion.div>
          </form>
          </motion.div>
        ) : (
          /* ── LIST VIEW ─────────────────────────────── */
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 px-4 pt-20 pb-28"
          >
            {isLoading ? (
              /* Loading skeletons */
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded-full bg-gray-100" />
                        <div className="h-3 w-20 rounded-full bg-gray-100" />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="h-16 rounded-xl bg-gray-100" />
                      <div className="h-16 rounded-xl bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : debts.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">Belum ada tipe hutang</p>
                <p className="mt-1 text-xs text-gray-400">Tap tombol + di atas untuk menambahkan</p>
                <Button onClick={openCreate} className="mt-6 gap-2" size="sm">
                  <Plus className="h-4 w-4" /> Tambah Tipe Hutang
                </Button>
              </motion.div>
            ) : (
              /* Debt cards */
              debts.map((debt, index) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <Building2 className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900">{debt.description}</h3>
                        <p className="mt-0.5 font-mono text-[11px] text-gray-400">{debt.payment_type_code}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(debt)}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(debt.id)}
                        disabled={deletingId === debt.id || isDeleting}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        {deletingId === debt.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total Hutang</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">{formatRupiah(debt.total_hutang)}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Tenor</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {debt.total_tenor ? `${debt.total_tenor} Bln` : "—"}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Mode Pembayaran</p>
                      <p className="mt-1 text-sm font-semibold capitalize text-gray-900">{debt.payment_mode}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
