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
  await supabase.auth.signUp({ email, password });

  // Check triggers on debt_payments
  const { data: triggers, error: trigErr } = await supabase.rpc("get_triggers_info");
  console.log("RPC triggers:", triggers, trigErr);

  // Try raw SQL via rpc if available
  // Otherwise let's try to get function source code
  const { data: funcs, error: funcErr } = await supabase
    .from("pg_catalog.pg_proc")
    .select("*");
  console.log("pg_proc:", funcs, funcErr);
}
main();
