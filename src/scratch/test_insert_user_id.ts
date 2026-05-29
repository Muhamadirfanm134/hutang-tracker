import { supabase } from "../lib/supabase";

async function main() {
  const { data, error } = await supabase
    .from("debts")
    .insert({
      description: "Test",
      payment_mode: "FLEXIBLE",
      payment_type_code: "TEST_XYZ",
      total_hutang: 1000,
      user_id: "00000000-0000-0000-0000-000000000000" // dummy UUID
    })
    .select();
    
  console.log("data", data);
  console.log("error", error);
}

main();
