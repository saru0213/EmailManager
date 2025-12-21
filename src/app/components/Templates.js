import { Edit2, FileText, Plus, Send, Trash2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Templates({
  openModal,
  templates,
  setSendEmailModal,
  setSelectedTemplate,
  setSelectedContacts,
  handleDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const openSendEmailModal = (template) => {
    setSelectedTemplate(template);
    setSelectedContacts([]);
    setSendEmailModal(true);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const nameMatch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = selectedDate
        ? t.createdAt && dayjs(t.createdAt.toDate()).isSame(selectedDate, "day")
        : true;

      return nameMatch && dateMatch;
    });
  }, [templates, searchTerm, selectedDate]);

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-2 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
        <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 md:flex-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
          />

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Filter by date"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            dateFormat="dd/MM/yyyy"
            isClearable
          />

          <button
            onClick={() => openModal("template")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition min-w-[130px] justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const previewText = `${template.intro || ""}\n\n${
            template.mainBody || ""
          }\n\n${template.footer || ""}`;

          const createdAtText = template.createdAt
            ? dayjs(template.createdAt.toDate()).format("DD/MM/YYYY")
            : "N/A";

          return (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border p-4 md:p-5 hover:shadow-md transition flex flex-col"
            >
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {createdAtText}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal("template", template)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete("template", template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {template.subject}
              </p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {previewText}
              </p>

              <button
                onClick={() => openSendEmailModal(template)}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm mt-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Bulk Email
              </button>
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No templates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;
