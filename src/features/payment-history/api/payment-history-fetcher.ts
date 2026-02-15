import { supabase } from "@/lib/supabase";
import {
  CreatePaymentInput,
  createPaymentSchema,
  Payment,
  paymentSchema,
  UpdatePaymentInput,
  updatePaymentSchema,
} from "../schema";

/**
 * GET ALL
 */
export async function getPaymentHistory(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payment_history")
    .select("*")
    .order("payment_period", { ascending: false });

  if (error) throw new Error(error.message);

  return paymentSchema.array().parse(data);
}

/**
 * GET BY ID
 */
export async function getPaymentById(id: string): Promise<Payment> {
  const { data, error } = await supabase.from("payment_history").select("*").eq("id", id).single();

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
    .from("payment_history")
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
    .from("payment_history")
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
  const { error } = await supabase.from("payment_history").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}
