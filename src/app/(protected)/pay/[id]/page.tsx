"use client";

import { PayForm } from "@/features/payment-history/components/pay-form";
import { usePaymentDetail } from "@/features/payment-history/hooks/use-payment-history";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import MobileHeader from "@/components/(design-systems)/mobileHeader";
import { FileText, Loader2 } from "lucide-react";

export default function EditPayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAdmin, isLoading } = useAuth();
  const { data, isLoading: isLoadingPayment, isError } = usePaymentDetail(id);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/home");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) return null;

  if (isLoadingPayment) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Edit Pembayaran" />
        <div className="flex flex-col items-center justify-center px-4 pt-32">
          <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Memuat data pembayaran...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <MobileHeader title="Edit Pembayaran" />
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

  return <PayForm key={data.id} payment={data} />;
}
