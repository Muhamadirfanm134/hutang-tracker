import { supabase } from "@/lib/supabase";
import {
  CreatePaymentInput,
  createPaymentSchema,
  Payment,
  PaymentTypeType,
  paymentSchema,
  UpdatePaymentInput,
  updatePaymentSchema,
} from "../schema";

export interface Debt {
  id: string;
  description: string;
  payment_mode: string;
  payment_type_code: string;
  total_hutang: number;
  total_tenor?: number | null;
  due_date?: string | null;
}

/**
 * GET DEBTS
 */
export async function getDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select("*");

  console.log("getDebts fetch result:", data, error);

  if (error) throw new Error(error.message);
  return data as Debt[];
}

/**
 * GET ALL
 */
export async function getPaymentHistory(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("debt_payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return paymentSchema.array().parse(data);
}

/**
 * GET BY TYPE (filtered by debt type)
 */
export async function getPaymentHistoryByType(type: PaymentTypeType): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("debt_payments")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return paymentSchema.array().parse(data);
}

/**
 * GET BY ID
 */
export async function getPaymentById(id: string): Promise<Payment> {
  const { data, error } = await supabase.from("debt_payments").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);

  return paymentSchema.parse(data);
}

/**
 * CREATE
 */
export async function createPayment(payload: CreatePaymentInput): Promise<Payment> {
  // Validate input
  const validated = createPaymentSchema.parse(payload);

  const { data, error } = await supabase
    .from("debt_payments")
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return paymentSchema.parse(data);
}

/**
 * UPDATE
 */
export async function updatePayment(id: string, payload: UpdatePaymentInput): Promise<Payment> {
  const validated = updatePaymentSchema.parse(payload);

  const { data, error } = await supabase
    .from("debt_payments")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return paymentSchema.parse(data);
}

/**
 * DELETE
 */
export async function deletePayment(id: string): Promise<{ success: true }> {
  const { error } = await supabase.from("debt_payments").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}
