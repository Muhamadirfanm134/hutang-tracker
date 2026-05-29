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
  
  console.log("profiles properties:", openapi.definitions?.profiles?.properties);
}
main();
