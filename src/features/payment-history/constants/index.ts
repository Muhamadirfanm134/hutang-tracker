import { PaymentTypeType } from "../schema";

export const PAYMENT_TYPE_LABEL: Record<PaymentTypeType, string> = {
  HUTANG_MOBIL: "Hutang Mobil",
  HUTANG_BAPAK: "Hutang Bapak",
  HUTANG_MBAIPIT: "Hutang Mba Ipit",
};

export function getPaymentTypeLabel(type: PaymentTypeType): string {
  return PAYMENT_TYPE_LABEL[type] ?? type;
}

/**
 * Color mapping for each debt type (used in badges, tabs, accents)
 */
export const PAYMENT_TYPE_COLORS: Record<
  PaymentTypeType,
  {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    activeText: string;
    gradient: string;
    light: string;
    dot: string;
  }
> = {
  HUTANG_MOBIL: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    activeBg: "bg-sky-600",
    activeText: "text-white",
    gradient: "from-sky-500 to-cyan-400",
    light: "bg-sky-100",
    dot: "bg-sky-500",
  },
  HUTANG_BAPAK: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    activeBg: "bg-amber-600",
    activeText: "text-white",
    gradient: "from-amber-500 to-orange-400",
    light: "bg-amber-100",
    dot: "bg-amber-500",
  },
  HUTANG_MBAIPIT: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    activeBg: "bg-violet-600",
    activeText: "text-white",
    gradient: "from-violet-500 to-purple-400",
    light: "bg-violet-100",
    dot: "bg-violet-500",
  },
};

/**
 * Tab order for the payment history categories
 */
export const PAYMENT_TYPE_TABS: PaymentTypeType[] = [
  "HUTANG_MOBIL",
  "HUTANG_BAPAK",
  "HUTANG_MBAIPIT",
];

/**
 * Emoji/icon for each type
 */
export const PAYMENT_TYPE_EMOJI: Record<PaymentTypeType, string> = {
  HUTANG_MOBIL: "🚗",
  HUTANG_BAPAK: "👨",
  HUTANG_MBAIPIT: "👩",
};
