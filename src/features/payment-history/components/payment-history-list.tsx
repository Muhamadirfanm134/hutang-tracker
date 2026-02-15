"use client";

import dayjs from "dayjs";
import { usePaymentHistory } from "../hooks/use-payment-history";
import { Badge } from "@/components/ui/badge";
import { getPaymentTypeLabel } from "../constants";
import { formatRupiah } from "@/lib/utils";
import Button from "@/components/(design-systems)/button/Button";
import { renameAllFiles } from "../utils/renameAllFiles";

export function PaymentHistoryList() {
  const { payments } = usePaymentHistory();

  return (
    <div className="mb-20 space-y-2 p-4">
      <Button onClick={renameAllFiles}>Rename</Button>
      {payments?.map((item) => (
        <div key={item.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
          <div className="flex items-center gap-4 divide-x divide-gray-400">
            <div className="w-1/5 p-2 text-right text-xs">
              <div>Cicilan</div>
              <div>
                ke-<b className="text-lg">{item.cicilan_ke}</b>
              </div>
            </div>
            <div className="w-4/5 space-y-2">
              <div className="text-xs">
                {dayjs(item.payment_period).format("ddd, DD MMM YYYY")} |{" "}
                <Badge className="bg-blue-50 text-xs text-blue-700">
                  {getPaymentTypeLabel(item.type)}
                </Badge>
              </div>
              <div className="text-xl font-bold">{formatRupiah(item.nominal)}</div>
              <hr />
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
