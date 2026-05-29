import { supabase } from "@/lib/supabase/client";

export async function syncPaymentAttachmentsIndo() {
  const bucket = "payment_attachment";
  const debtId = "4220b617-75d9-499b-87cb-06f8b597a914";
  const folder = debtId;

  const bulanIndo: Record<number, string> = {
    0: "jan",
    1: "feb",
    2: "mar",
    3: "apr",
    4: "mei",
    5: "jun",
    6: "jul",
    7: "agu",
    8: "sep",
    9: "okt",
    10: "nov",
    11: "des",
  };

  // 1️⃣ ambil semua payment
  const { data: payments, error: paymentError } = await supabase
    .from("debt_payments")
    .select("id, created_at, payment_attachment")
    .eq("debt_id", debtId);

  if (paymentError) {
    console.error(paymentError);
    return;
  }

  // 2️⃣ ambil semua file dalam folder
  const { data: files, error: fileError } = await supabase.storage.from(bucket).list(folder);

  if (fileError) {
    console.error(fileError);
    return;
  }

  if (!payments || !files) return;

  for (const payment of payments) {
    const date = new Date(payment.created_at);
    const month = bulanIndo[date.getMonth()];
    const year = date.getFullYear();

    // cari semua file yang match bulan & tahun
    const matchedFiles = files.filter(
      (file) => file.name.toLowerCase().includes(month) && file.name.includes(String(year))
    );

    if (!matchedFiles.length) continue;

    const filePaths = matchedFiles.map((file) => `${folder}/${file.name}`);

    // gabungkan dengan existing array (kalau ada)
    const existing = payment.payment_attachment ?? [];
    const updatedArray = [...new Set([...existing, ...filePaths])];

    console.log("Update:", payment.id, updatedArray);

    const { error: updateError } = await supabase
      .from("debt_payments")
      .update({ payment_attachment: updatedArray })
      .eq("id", payment.id);

    if (updateError) {
      console.error(updateError);
    }
  }

  console.log("SYNC DONE 🇮🇩");
}
