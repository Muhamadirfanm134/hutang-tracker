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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

async function main() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
  const openapi = await res.json();
  
  // Actually we can't fetch triggers via openapi. 
  // Let's just create the client and try to insert without .select()
  
  const supabase = createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";
  await supabase.auth.signUp({ email, password });
  
  // Insert without select()
  const { data, error } = await supabase.from("debt_payments").insert({
    debt_id: "00000000-0000-0000-0000-000000000000",
    type: "HUTANG_MOBIL",
    amount: 10000,
    pembayaran_ke: 1,
    note: "test",
    sisa_pembayaran: 0,
  });
  
  console.log("Insert without select error:", JSON.stringify(error, null, 2));
}
main();
