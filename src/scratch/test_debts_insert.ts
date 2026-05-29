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
  const email = `test-admin-${Date.now()}@example.com`;
  const password = "password123";

  // 1. Sign up
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authErr) {
    console.error("Sign up failed:", authErr);
    return;
  }
  console.log("Signed up as:", authData.user?.id);

  // 2. Try to insert to debts
  const { data: insertData, error: insertError } = await supabase
    .from("debts")
    .insert({
      description: "Test Insert",
      payment_mode: "FLEXIBLE",
      payment_type_code: "TEST_INSERT_RLS",
      total_hutang: 5000000,
    })
    .select();

  console.log("Insert result:", insertData);
  console.log("Insert error:", insertError);
}
main();
