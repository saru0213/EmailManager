import * as XLSX from "xlsx";
import { saveContact } from "@/lib/firestorehelperfunction";

export const importContactsFromExcel = async (
  file,
  USER_ID,
  groups,
  existingContacts
) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet);

  for (const row of rows) {
    if (!row.name || !row.email) continue;

    
    const exists = existingContacts.some(
      (c) => c.email.toLowerCase() === row.email.toLowerCase()
    );
    if (exists) continue;

    
    const group = groups.find(
      (g) => g.name.toLowerCase() === row.group?.toLowerCase()
    );

    if (!USER_ID) {
      console.log("user id not found");
    }

    await saveContact(USER_ID, {
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      post: row.post || "",
      groupId: group?.id || "",
    });
  }
};
