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
const supabase = createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";

  await supabase.auth.signUp({ email, password });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log("No session");
    return;
  }

  // Get table definitions via authenticated request
  const res2 = await fetch(`${supabaseUrl}/rest/v1/?apikey=${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, {
    headers: {
      "Authorization": `Bearer ${session.access_token}`
    }
  });
  const openapi = await res2.json();
  console.log("debts columns:", openapi.definitions?.debts?.properties ? Object.keys(openapi.definitions.debts.properties) : "not found");
  console.log("debt_payments columns:", openapi.definitions?.debt_payments?.properties ? Object.keys(openapi.definitions.debt_payments.properties) : "not found");
}
main();
