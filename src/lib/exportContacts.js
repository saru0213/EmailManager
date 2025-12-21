import * as XLSX from "xlsx";

export const exportContactsToExcel = (contacts, groups) => {
  const data = contacts.map((c) => {
    const group = groups.find((g) => g.id === c.groupId);

    return {
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      post: c.post || "",
      group: group?.name || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

  XLSX.writeFile(workbook, "contacts.xlsx");
};
