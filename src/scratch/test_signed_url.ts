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

  // Login/Signup
  await supabase.auth.signUp({ email, password });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return;
  const userId = session.user.id;
  
  // Make admin
  await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);

  // Try createSignedUploadUrl
  const { data, error } = await supabase.storage
    .from("payment_attachment")
    .createSignedUploadUrl(`${userId}/test.jpg`);
    
  console.log("createSignedUploadUrl error:", error);
  console.log("createSignedUploadUrl data:", data);

  // Try without user id
  const { data: d2, error: e2 } = await supabase.storage
    .from("payment_attachment")
    .createSignedUploadUrl(`4220b617-75d9-499b-87cb-06f8b597a914/test.jpg`);
  
  console.log("createSignedUploadUrl debt_id error:", e2);
}
main();
