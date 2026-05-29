import { supabase } from "../lib/supabase";

async function main() {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .limit(1);
    
  console.log("data", data);
  console.log("error", error);
}

main();
