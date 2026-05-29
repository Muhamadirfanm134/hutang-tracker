import { supabase } from "@/lib/supabase";
import { Debt } from "@/features/payment-history/api/payment-history-fetcher";

export type CreateDebtInput = Omit<Debt, "id">;
export type UpdateDebtInput = Partial<CreateDebtInput>;

export async function getDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Debt[];
}

export async function createDebt(payload: CreateDebtInput): Promise<Debt> {
  const { data, error } = await supabase
    .from("debts")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Debt;
}

export async function updateDebt(id: string, payload: UpdateDebtInput): Promise<Debt> {
  const { data, error } = await supabase
    .from("debts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Debt;
}

export async function deleteDebt(id: string): Promise<{ success: true }> {
  const { error } = await supabase.from("debts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}
