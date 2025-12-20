import React from "react";

function EditContact({ formData, handleInputChange, groups }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          suppressHydrationWarning
          type="text"
          value={formData.name || ""}
          placeholder="Eg. Saraswati Adkine"
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email || ""}
          placeholder="Eg. adkinesara@gmail.com"
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. +91 9551234567"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Group
        </label>
        <select
          value={formData.groupId || ""}
          onChange={(e) => handleInputChange("groupId", e.target.value)}
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No Selected Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default EditContact;
