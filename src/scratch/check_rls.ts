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
// Need service role key to check policies if anon key is not enough, but anon key might be enough to query pg_policies?
// Wait, we can't query pg_policies via postgREST unless it's exposed. Let's check using SQL query or just skip.
// Let's just try inserting to storage to see the exact error.

async function main() {
  const supabase = createClient(supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Actually let's just create a test file and upload it
  console.log(supabaseUrl);
}
main();
