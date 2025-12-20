import React from "react";

function EditGroup({ formData, handleInputChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Group Name
        </label>
        <input
          type="text"
          value={formData.name || ""}
          placeholder="eg. Development,Marketing etc"
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description || ""}
          placeholder="What this group work for or some thing else..."
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows="3"
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </>
  );
}

export default EditGroup;
