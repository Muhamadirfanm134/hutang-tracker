import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
const env: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";

  // 1. Register a dummy user
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authErr) {
    console.error("Sign up failed:", authErr);
    return;
  }

  // Try to insert a debt payment
  const { data, error } = await supabase.from("debt_payments").insert({
    debt_id: "00000000-0000-0000-0000-000000000000",
    type: "HUTANG_MOBIL",
    amount: 10000,
    pembayaran_ke: 1,
    note: "test",
    sisa_pembayaran: 0,
  });
  console.log("Debt payments insert error object:", JSON.stringify(error, null, 2));

  const dummyFile = new Blob(["test content"], { type: "text/plain" });
  const res1 = await supabase.storage.from("payment_attachment").upload(`test1.txt`, dummyFile);
  console.log("Storage upload error object:", JSON.stringify(res1.error, null, 2));
}
main();
