import { supabase } from "../lib/supabase";

async function main() {
  // Query information_schema.columns via a postgrest request to a view if possible?
  // Actually, postgrest doesn't expose information_schema by default.
  // But we can query it using a rpc if there is one.
  // Wait, let's check if we can query it using a postgrest trick or just inspect it by selecting all fields from a dummy query.
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .limit(1);

  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    console.log("No rows returned from debts. Data:", data, "Error:", error);
  }
}
main();
