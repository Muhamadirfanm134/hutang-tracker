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

async function testColumn(colName: string) {
  const { error } = await supabase
    .from("debts")
    .insert({
      description: "Test Col",
      payment_mode: "FLEXIBLE",
      payment_type_code: "HUTANG_MOBIL",
      total_hutang: 1000,
      [colName]: "00000000-0000-0000-0000-000000000000"
    });
  
  if (error && error.message.includes("Could not find the")) {
    return false; // Column does not exist
  }
  return true; // Column exists (or failed with policy violation / type error)
}

async function main() {
  const cols = ["user_id", "profile_id", "created_by", "owner_id", "userId", "profileId", "user"];
  for (const col of cols) {
    const exists = await testColumn(col);
    console.log(`Column '${col}':`, exists ? "EXISTS" : "DOES NOT EXIST");
  }
}
main();
