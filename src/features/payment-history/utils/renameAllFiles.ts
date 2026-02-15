import { supabase } from "@/lib/supabase/client";

export async function renameAllFiles() {
  const bucket = "payment_attachment";
  const folder = "4220b617-75d9-499b-87cb-06f8b597a914";

  const { data: files, error } = await supabase.storage.from(bucket).list(folder, { limit: 1000 });

  if (error) {
    console.error("List error:", error);
    return;
  }

  if (!files || files.length === 0) {
    console.log("Tidak ada file dalam folder.");
    return;
  }

  for (const file of files) {
    console.log("RAW FILE:", file);

    const oldPath = folder + "/" + file.name;

    console.log("TRY MOVE FROM:", oldPath);

    // const { error: moveError } = await supabase.storage
    //   .from(bucket)
    //   .move(oldPath, oldPath + ".test");
    const { error: moveError } = await supabase.storage
      .from(bucket)
      .move(
        "4220b617-75d9-499b-87cb-06f8b597a914/1. 25 Juni 2024.jpeg",
        "4220b617-75d9-499b-87cb-06f8b597a914/test.jpeg"
      );

    console.log(error);

    console.log("ERROR:", moveError);

    break; // test 1 file dulu
  }

  console.log("DONE");
}
