import { z } from "zod";

export const PaymentTypeCodeEnum = z.enum(["HUTANG_MOBIL", "HUTANG_BAPAK", "HUTANG_MBAIPIT"]);

export type PaymentTypeType = z.infer<typeof PaymentTypeCodeEnum>;

/**
 * Base Schema (match database)
 */
export const paymentSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime({ offset: true }), // ISO with timezone
  type: PaymentTypeCodeEnum,
  nominal: z.coerce.number().int().nonnegative(),
  payment_attachment: z.string().url("Attachment must be a valid URL").optional().nullable(),
  payment_period: z.string().min(1, "Payment period is required"),
  cicilan_ke: z.number(),
});

/**
 * Insert Schema
 * id & created_at biasanya auto-generated
 */
export const createPaymentSchema = paymentSchema.omit({
  id: true,
  created_at: true,
});

/**
 * Update Schema
 */
export const updatePaymentSchema = createPaymentSchema.partial();

/**
 * Types
 */
export type Payment = z.infer<typeof paymentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
