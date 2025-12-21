"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { MdManageAccounts } from "react-icons/md";
import { saveContact, getContacts } from "@/lib/firestorehelperfunction";
import { useSearchParams } from "next/navigation";

export default function CreateContactClient() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const params = useSearchParams();
  const USER_ID = params.get("uid");
  const token = params.get("token");
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    post: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    post: "",
  });

  const validate = async () => {
    try {
      const res = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const text = await res.text();

      if (!text) {
        setError("Empty response from server");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setError("Invalid server response");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Invite link invalid");
        return;
      }

      setUserId(data.userId);
    } catch (err) {
      setError("Network error");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Invalid invite link");
      return;
    }

    validate();
  }, [token]);

  /* ------------------------------------
     Load existing contacts
  ------------------------------------ */
  const loadData = async () => {
    try {
      const data = await getContacts(USER_ID);
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please refresh the page.");
    }
  };

  useEffect(() => {
    if (USER_ID) {
      loadData();
    }
  }, [USER_ID]);

  /* ------------------------------------
     Validation
  ------------------------------------ */
  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", post: "" };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    if (!formData.post.trim()) {
      newErrors.post = "Post is required";
      isValid = false;
    } else if (formData.post.trim().length < 2) {
      newErrors.post = "Post must be at least 2 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ------------------------------------
     Save contact
  ------------------------------------ */
  const handleSaveContact = async () => {
    setError("");
    setShowSuccess(false);

    if (!validate()) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Duplicate email check
    const emailExists = contacts.some(
      (c) => c.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (emailExists) {
      setError("This email is already used by another contact.");
      return;
    }

    // Duplicate phone check
    if (formData.phone) {
      const phoneExists = contacts.some(
        (c) => c.phone === formData.phone.trim()
      );

      if (phoneExists) {
        setError("This phone number is already used by another contact.");
        return;
      }
    }

    setLoading(true);

    try {
      await saveContact(userId, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || "",
        post: formData.post.trim() || "",
        groupId: "",
      });

      setFormData({ name: "", email: "", phone: "", post: "" });
      setErrors({ name: "", email: "", phone: "", post: "" });
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

      await loadData();
    } catch (err) {
      setError("Failed to save contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------
     Handle input changes with validation
  ------------------------------------ */
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    if (error) setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSaveContact();
    }
  };

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!userId) {
    return <p className="text-center">Validating invite...</p>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create New Contact
            </CardTitle>
            <p className="text-sm text-gray-500">
              Add a new contact to your list
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Alert */}
            {showSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Contact saved successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onKeyPress={handleKeyPress}
                className={`h-11 text-black ${
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onKeyPress={handleKeyPress}
                className={`h-11 text-black ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onKeyPress={handleKeyPress}
                className={`h-11 text-black ${
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                disabled={loading}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* post Field */}
            <div className="space-y-2">
              <Label
                htmlFor="post"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <MdManageAccounts className="w-4 h-4" />
                Post <span className="text-red-500">*</span>
              </Label>
              <Input
                id="post"
                type="tel"
                placeholder="Eg. Marketing Manager,Full Stack developer etc."
                value={formData.post}
                onChange={(e) => handleInputChange("post", e.target.value)}
                onKeyPress={handleKeyPress}
                className={`h-11 text-black ${
                  errors.post ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={loading}
                required
              />
              {errors.post && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.post}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSaveContact}
                disabled={loading}
                className="flex-1 h-11 text-white border bg-gray-600 text-base font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Contact
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setFormData({ name: "", email: "", phone: "" });
                  setErrors({ name: "", email: "", phone: "" });
                  setError("");
                  setShowSuccess(false);
                }}
                disabled={loading}
                className="flex-1 sm:flex-none h-11 text-base font-semibold"
              >
                Clear Form
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 text-center pt-2">
              Fields marked with <span className="text-red-500">*</span> are
              required
            </p>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Make sure to enter a valid email address.
            We&#39;ll check for duplicates automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
