import { Send, X } from "lucide-react";
import React from "react";

function SendBulkEmail({
  handleSendBulkEmail,
  setSendEmailModal,
  selectedTemplate,
  groups,
  contacts,
  isSelected,
  selectedContacts,
  selectGroupContacts,
}) {
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Send Bulk Email
            </h3>
            <button
              onClick={() => setSendEmailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                {selectedTemplate?.name}
              </h4>
              <p className="text-sm text-blue-800">
                <strong>Subject:</strong> {selectedTemplate?.subject}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-3 text-gray-800">
                Select Recipients
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => selectGroupContacts(group.id)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                  >
                    Select all in {group.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto mb-6">
              {contacts.map((contact) => {
                const group = groups.find((g) => g.id === contact.groupId);
                const isSelected = selectedContacts.includes(contact.id);
                return (
                  <label
                    key={contact.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="w-4 h-4 text-blue-600 rounded mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contact.email}
                      </div>
                    </div>
                    {group && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {group.name}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {selectedContacts.length} recipient
                {selectedContacts.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSendEmailModal(false)}
                  className="px-4 text-black py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBulkEmail}
                  disabled={selectedContacts.length === 0 || sending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Emails
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SendBulkEmail;
