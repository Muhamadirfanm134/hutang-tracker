import { z } from "zod";

export const PaymentTypeCodeEnum = z.string();

export type PaymentTypeType = string;

/**
 * Base Schema (match database)
 */
export const paymentSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  debt_id: z.string().uuid(),
  type: PaymentTypeCodeEnum,
  amount: z.coerce.number().int().nonnegative(),
  payment_attachment: z.array(z.string()).optional().nullable(),
  pembayaran_ke: z.coerce.number().int().nonnegative(),
  note: z.string().optional().nullable(),
  sisa_pembayaran: z.coerce.number().int().optional().nullable(),
});

/**
 * Insert Schema
 * id & created_at biasanya auto-generated
 */
export const createPaymentSchema = paymentSchema
  .omit({
    id: true,
    created_at: true,
  })
  .extend({
    created_at: z.string().optional(),
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
