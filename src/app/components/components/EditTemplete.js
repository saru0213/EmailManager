import React from "react";
import AITemplateEditor from "../AITemplateGenerator";

function EditTemplete({ handleInputChange, formData, setFormData }) {
  return (
    <>
      {/* Template Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template Name
        </label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Eg. Placement Conformation"
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <input
          type="text"
          value={formData.subject || ""}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          placeholder="Add subject"
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email Intro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Introduction
        </label>
        <textarea
          rows="3"
          value={formData.intro || ""}
          onChange={(e) => handleInputChange("intro", e.target.value)}
          placeholder="Add intro..."
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* MAIN EMAIL SECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Email Section
        </label>
        <textarea
          rows="8"
          value={formData.mainBody || ""}
          onChange={(e) => handleInputChange("mainBody", e.target.value)}
          placeholder="Add more info..."
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Use {"{{name}}"},{"{{phone}}"} and {"{{email}}"} for
          personalization
        </p>
      </div>

      {/* Footer / Signature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Footer / Signature
        </label>
        <textarea
          rows="3"
          value={formData.footer || ""}
          onChange={(e) => handleInputChange("footer", e.target.value)}
          placeholder="Add signature..."
          className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* AI Editor */}
      <AITemplateEditor formData={formData} setFormData={setFormData} />
    </>
  );
}

export default EditTemplete;
