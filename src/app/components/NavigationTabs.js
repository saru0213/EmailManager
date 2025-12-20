import { FileText, Filter, NotebookTabs, Users } from "lucide-react";
import React from "react";

function NavigationTabs({ setActiveTab, activeTab }) {
  return (
    <>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === "templates"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === "contacts"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Contacts
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === "groups"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Groups
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === "log"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <NotebookTabs className="w-4 h-4 inline mr-2" />
              Log
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavigationTabs;
