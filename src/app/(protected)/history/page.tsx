import { PaymentHistoryList } from "@/features/payment-history/components/payment-history-list";
import { Suspense } from "react";

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50 flex items-center justify-center text-gray-500">Memuat riwayat...</div>}>
      <PaymentHistoryList />
    </Suspense>
  );
}
