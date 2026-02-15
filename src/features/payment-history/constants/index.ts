import { PaymentTypeType } from "../schema";

export const PAYMENT_TYPE_LABEL: Record<PaymentTypeType, string> = {
  HUTANG_MOBIL: "Hutang Mobil",
  HUTANG_BAPAK: "Hutang Bapak",
  HUTANG_MBAIPIT: "Hutang Mba Ipit",
};

export function getPaymentTypeLabel(type: PaymentTypeType): string {
  return PAYMENT_TYPE_LABEL[type] ?? type;
}
