import { supabase } from "@/lib/supabase/client";

export async function renameAllFiles() {
  const bucket = "payment_attachment";
  const folder = "4220b617-75d9-499b-87cb-06f8b597a914";

  const { data: files, error } = await supabase.storage.from(bucket).list(folder);

  if (error) {
    console.error("List error:", error);
    return;
  }

  for (const file of files ?? []) {
    const oldPath = `${folder}/${file.name}`;

    // Remove leading number + dot
    const nameWithoutNumber = file.name.replace(/^\d+\.\s*/, "");

    // Split extension
    const [rawName, ext] = nameWithoutNumber.split(/\.(?=[^\.]+$)/);

    // Clean name
    const cleaned = rawName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");

    const timestamp = Date.now();

    const newName = `${cleaned}-${timestamp}.${ext}`;

    const newPath = `${folder}/${newName}`;

    if (oldPath === newPath) continue;

    console.log("Moving:", oldPath, "→", newPath);

    const { error: moveError } = await supabase.storage.from(bucket).move(oldPath, newPath);

    if (moveError) {
      console.error("Move error:", moveError);
      continue;
    }

    console.log("Renamed:", newName);
  }

  console.log("DONE");
}
