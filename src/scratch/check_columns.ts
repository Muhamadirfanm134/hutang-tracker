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
  const res = await fetch(`${supabaseUrl}/rest/v1/debt_payments?select=*&limit=1`, {
    method: "GET",
    headers: {
      "apikey": env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
  });
  
  const data = await res.json();
  console.log("debt_payments columns:", data[0] ? Object.keys(data[0]) : "No data");
  
  // also check if we can see the exact RLS policies by querying information_schema if we had service key... but we don't.
}
main();
