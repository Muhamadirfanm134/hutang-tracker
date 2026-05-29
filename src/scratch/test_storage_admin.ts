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
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session?.user?.id;
  
  if (!userId) return;

  // Make the user an admin
  await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);
  
  const dummyFile = new Blob(["test content"], { type: "text/plain" });

  // Test 1: Upload to root
  const res1 = await supabase.storage.from("payment_attachment").upload(`test1.txt`, dummyFile);
  console.log("Admin Test 1 (root):", res1.error ? res1.error.message : "Success");

  // Test 3: Upload to userId/
  const res3 = await supabase.storage.from("payment_attachment").upload(`${userId}/test3.txt`, dummyFile);
  console.log("Admin Test 3 (userId/):", res3.error ? res3.error.message : "Success");
}
main();
