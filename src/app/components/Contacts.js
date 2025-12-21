import { exportContactsToExcel } from "@/lib/exportContacts";
import { importContactsFromExcel } from "@/lib/importContacts";
import {
  Download,
  Edit2,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import React from "react";

function Contacts({
  searchTerm,
  setSearchTerm,
  filterGroup,
  openModal,
  groups,
  filteredContacts,
  handleDelete,
  setFilterGroup,
  USER_ID,
}) {
  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 text-black pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => openModal("contact")}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
            <div className="flex gap-2">
              {/* Export */}
              <button
                onClick={() => exportContactsToExcel(filteredContacts, groups)}
                title="export data"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex justify-center gap-1"
              >
                Export
                <Download className="w-4 h-4 mt-1" />
              </button>

              {/* Import */}
              {USER_ID.length > 0 && (
                <label className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="flex justify-center gap-1">
                    <Upload className="w-4 h-4 mt-1" />
                    Import
                  </span>

                  <input
                    type="file"
                    accept=".xlsx"
                    hidden
                    title="import data"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      await importContactsFromExcel(
                        file,
                        USER_ID,
                        groups,
                        filteredContacts
                      );

                      alert("Contacts imported successfully");
                      window.location.reload();
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Group
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContacts.map((contact) => {
                  const group = groups.find((g) => g.id === contact.groupId);
                  return (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.phone || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.post || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {group && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {group.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openModal("contact", contact)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete("contact", contact.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No contacts found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Contacts;
