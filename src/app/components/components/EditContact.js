import React, { useState, useEffect } from "react";

function EditContact({ formData, handleInputChange, groups }) {
  const [errors, setErrors] = useState({});


  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "phone":
        if (value && !/^\+?[0-9]{7,15}$/.test(value)) {
          error = "Invalid phone number";
        }
        break;
      case "groupId":
        if (!value) error = "Please select a group";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };


  const validateAll = () => {
    let valid = true;
    ["name", "email", "phone", "groupId"].forEach((field) => {
      if (!validateField(field, formData[field] || "")) valid = false;
    });
    return valid;
  };

  const handleChange = (field, value) => {
    handleInputChange(field, value);
    validateField(field, value);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ""}
          placeholder="Eg. John Doe"
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email || ""}
          placeholder="Eg. john@example.com"
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone || ""}
          placeholder="Eg. +919551234567"
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.phone ? "border-red-500" : ""
          }`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post
        </label>
        <input
          type="text"
          value={formData.post || ""}
          placeholder="Eg. Full Stack Developer"
          onChange={(e) => handleChange("post", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.groupId || ""}
          onChange={(e) => handleChange("groupId", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.groupId ? "border-red-500" : ""
          }`}
        >
          <option value="">Select a group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {errors.groupId && <p className="text-red-500 text-sm mt-1">{errors.groupId}</p>}
      </div>
    </>
  );
}

export default EditContact;
