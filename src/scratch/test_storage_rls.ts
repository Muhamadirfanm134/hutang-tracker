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

  console.log("Logged in as:", authData.user?.id);
  const userId = authData.user?.id;
  const dummyFile = new Blob(["test content"], { type: "text/plain" });

  // Test 1: Upload to root
  const res1 = await supabase.storage.from("payment_attachment").upload(`test1.txt`, dummyFile);
  console.log("Test 1 (root):", res1.error ? res1.error.message : "Success");

  // Test 2: Upload to debtId/
  const res2 = await supabase.storage.from("payment_attachment").upload(`some-debt-id/test2.txt`, dummyFile);
  console.log("Test 2 (debtId/):", res2.error ? res2.error.message : "Success");

  // Test 3: Upload to userId/
  const res3 = await supabase.storage.from("payment_attachment").upload(`${userId}/test3.txt`, dummyFile);
  console.log("Test 3 (userId/):", res3.error ? res3.error.message : "Success");

  // Test 4: Upload to userId/debtId/
  const res4 = await supabase.storage.from("payment_attachment").upload(`${userId}/some-debt-id/test4.txt`, dummyFile);
  console.log("Test 4 (userId/debtId/):", res4.error ? res4.error.message : "Success");
  
  // Cleanup user (optional, if we had service key)
}
main();
