"use client";
import React, { useState, useEffect } from "react";
import { Mail, Send, X } from "lucide-react";
import Templates from "./components/Templates";
import Contacts from "./components/Contacts";

import {
  getContacts,
  getGroups,
  getTemplates,
  saveTemplate,
  saveContact,
  saveGroup,
  deleteTemplate,
  deleteContact,
  deleteGroup,
  getSendLogs,
} from "@/lib/firestorehelperfunction";

import Groups from "./components/Groups";
import { useRouter } from "next/navigation";
import ProfileMenu from "./components/ProfileMenu";
import NavigationTabs from "./components/NavigationTabs";
import EditTemplete from "./components/components/EditTemplete";
import EditContact from "./components/components/EditContact";
import EditGroup from "./components/components/EditGroup";
import SendLogTable from "./components/SendLogTable";
import InviteLink from "./components/components/CopyButton";

const EmailManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [sendEmailModal, setSendEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [uId, setUId] = useState("");

  useEffect(() => {
    if (!uId) return;

    const loadLogs = async () => {
      setLoading(true);
      const data = await getSendLogs(uId);
      setLogs(data);
      setLoading(false);
    };

    loadLogs();
  }, [uId]);

 useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.replace("/auth");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();

      setUser(data);
      setUId(data.userId);

      // // ✅ NEW: store app password if needed
      // setAppPassword(data.appPassword);

    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      router.replace("/auth");
    }
  };

  fetchUser();
}, [router]);


  const USER_ID = user?.userId;

  const loadData = async (USER_ID) => {
    try {
      const [templatesData, contactsData, groupsData] = await Promise.all([
        getTemplates(USER_ID),
        getContacts(USER_ID),
        getGroups(USER_ID),
      ]);

      setTemplates(templatesData);
      setContacts(contactsData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    if (USER_ID) {
      loadData(USER_ID);
    }
  }, [USER_ID]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTemplate = async () => {
    if (
      !formData.name ||
      !formData.subject ||
      !formData.intro ||
      !formData.mainBody ||
      !formData.footer
    ) {
      alert("Please fill in all fields");
      return;
    }

    await saveTemplate(USER_ID, {
      id: editingItem?.id,
      name: formData.name,
      subject: formData.subject,
      intro: formData.intro,
      mainBody: formData.mainBody,
      footer: formData.footer,
    });

    await loadData(USER_ID);
    closeModal();
  };

  const handleSaveContact = async () => {
    if (!formData.name || !formData.email || !formData.post) {
      alert("Please fill in name and email");
      return;
    }

    // Check for duplicate email
    const emailExists = contacts.some(
      (c) =>
        c.email.toLowerCase() === formData.email.toLowerCase() &&
        c.id !== editingItem?.id
    );

    if (emailExists) {
      alert("This email is already used by another contact.");
      return;
    }

    // Check for duplicate phone (if provided)
    if (formData.phone) {
      const phoneExists = contacts.some(
        (c) => c.phone === formData.phone && c.id !== editingItem?.id
      );
      if (phoneExists) {
        alert("This phone number is already used by another contact.");
        return;
      }
    }

    await saveContact(USER_ID, {
      id: editingItem?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      post: formData.post || "",
      groupId: formData.groupId || "",
    });

    await loadData(USER_ID);
    closeModal();
  };

  const handleSaveGroup = async () => {
    if (!formData.name) {
      alert("Please enter a group name");
      return;
    }

    // Check for duplicate group name (case-insensitive)
    const groupExists = groups.some(
      (g) =>
        g.name.toLowerCase() === formData.name.toLowerCase() &&
        g.id !== editingItem?.id
    );

    if (groupExists) {
      alert("A group with this name already exists.");
      return;
    }

    await saveGroup(USER_ID, {
      id: editingItem?.id,
      name: formData.name,

      description: formData.description || "",
    });

    await loadData(USER_ID);
    closeModal();
  };

  const handleSave = () => {
    if (modalType === "template") {
      handleSaveTemplate();
    } else if (modalType === "contact") {
      handleSaveContact();
    } else {
      handleSaveGroup();
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      if (type === "template") {
        await deleteTemplate(id);
      } else if (type === "contact") {
        await deleteContact(id);
      } else if (type === "group") {
        await deleteGroup(id); 
      }

      await loadData(USER_ID); 
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item");
    }
  };

  const toggleContactSelection = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectGroupContacts = (groupId) => {
    const groupContacts = contacts
      .filter((c) => c.groupId === groupId)
      .map((c) => c.id);
    setSelectedContacts(groupContacts);
  };

  const sendEmail = async (to, subject, html) => {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        groupId: groupId?.id || null,
        groupName: groupId?.name || null,
        userId: user?.userId,
         fromEmail:user?.email,
        appPassword:user?.appPassword,
        
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to send email");
    }

    return res.json();
  };

  const handleSendBulkEmail = async () => {
    try {
      setSending(true);

      const selectedContactsList = contacts.filter((c) =>
        selectedContacts.includes(c.id)
      );

      for (const contact of selectedContactsList) {
       
        let body = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .intro {
                margin-bottom: 20px;
              }
              .main {
                margin-bottom: 20px;
              }
              .footer {
                font-size: 0.9em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="intro">${selectedTemplate.intro || ""}</div>
            <div class="main">${selectedTemplate.mainBody || ""}</div>
            <div class="footer">${selectedTemplate.footer || ""}</div>
          </body>
        </html>
      `;

  
        body = body.replace(/\{\{name\}\}/g, contact.name || "");
        body = body.replace(/\{\{email\}\}/g, contact.email || "");
        body = body.replace(/\{\{phone\}\}/g, contact.phone || "");

    
        await sendEmail(contact.email, selectedTemplate.subject, body);
      }

      alert(`Successfully sent ${selectedContactsList.length} emails!`);
      setSendEmailModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to send some emails");
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (c.name && c.name.toLowerCase().includes(search)) ||
      (c.post && c.post.toLowerCase().includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search)) ||
      (c.phone && c.phone.toString().includes(search)); // 👈 phone support

    const matchesGroup = filterGroup === "all" || c.groupId === filterGroup;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center md:space-x-3 space-x-1">
              <Mail className="w-8 h-8 text-blue-600" />
              <h1 className="md:text-2xl text-xl font-bold text-gray-900">
                Email Manager
              </h1>
              <InviteLink uId={uId} />
            </div>
            <ProfileMenu
              user={user}
              onLogout={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth";
              }}
            />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <NavigationTabs setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Templates Tab */}
        {activeTab === "templates" && (
          <>
            <Templates
              openModal={openModal}
              templates={templates}
              handleDelete={handleDelete}
              setSendEmailModal={setSendEmailModal}
              setSelectedTemplate={setSelectedTemplate}
              setSelectedContacts={setSelectedContacts}
            />
          </>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <Contacts
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterGroup={filterGroup}
            openModal={openModal}
            groups={groups}
            filteredContacts={filteredContacts}
            handleDelete={handleDelete}
            setFilterGroup={setFilterGroup}
            USER_ID={uId}
          />
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <Groups
            openModal={openModal}
            groups={groups}
            contacts={contacts}
            handleDelete={handleDelete}
          />
        )}
        {activeTab === "log" && <SendLogTable logs={logs} loading={loading} />}
       
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-black">
                {editingItem ? "Edit" : "Create"}{" "}
                {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalType === "template" && (
                <EditTemplete
                  handleInputChange={handleInputChange}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {modalType === "contact" && (
                <EditContact
                  formData={formData}
                  handleInputChange={handleInputChange}
                  groups={groups}
                />
              )}

              {modalType === "group" && (
                <EditGroup
                  handleInputChange={handleInputChange}
                  formData={formData}
                />
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-black border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {sendEmailModal && (
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
                  {selectedTemplate.name}
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>Subject:</strong> {selectedTemplate.subject}
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
                      onClick={() => {
                        selectGroupContacts(group.id);
                        setGroupId(group);
                      }}
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
                          {contact.email} | {contact.phone}
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
      )}
    </div>
  );
};

export default EmailManagementSystem;
