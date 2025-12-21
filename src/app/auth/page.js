"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // ✅ NEW: App password states
  const [appPassword, setAppPassword] = useState("");
  const [showAppPassword, setShowAppPassword] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/");
  }, [router]);

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isValidPassword = (password) => password.length >= 8;

  const isValidAppPassword = (password) => /^[a-z]{16}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidGmail(loginEmail)) {
      return alert("Please enter a valid Gmail address.");
    }

    if (!isValidPassword(loginPassword)) {
      return alert("Password must be at least 8 characters.");
    }

 
    if (!isValidAppPassword(appPassword)) {
      return alert("App Password must be exactly 16 lowercase letters (a–z).");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          appPassword, 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert(`Welcome ${data.user.name}`);
        setLoginEmail("");
        setLoginPassword("");
        setAppPassword("");
        router.replace("/");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupName.trim()) return alert("Name cannot be empty.");
    if (!isValidGmail(signupEmail))
      return alert("Please enter a valid Gmail address.");
    if (!isValidPassword(signupPassword))
      return alert("Password must be at least 8 characters.");
    if (signupPassword !== confirmPassword)
      return alert("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! You can now log in.");
        setActiveTab("login");
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-around mb-6 text-gray-600">
          <button
            className={`py-2 px-4 font-semibold rounded ${
              activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 font-semibold rounded ${
              activeTab === "signup" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Gmail Address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

        
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

         
            <div className="relative">
              <input
                type={showAppPassword ? "text" : "password"}
                placeholder="App Password (16 lowercase letters)"
                value={appPassword}
                onChange={(e) => {
                  const v = e.target.value.toLowerCase();
                  if (/^[a-z]*$/.test(v) && v.length <= 16) {
                    setAppPassword(v);
                  }
                }}
                maxLength={16}
                className="w-full p-2 border rounded"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowAppPassword(!showAppPassword)}
              >
                {showAppPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

       
            <div className="text-right">
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                className="text-xs text-blue-600 underline"
              >
                Create App Password
              </a>
            </div>

      
            <div className="text-xs bg-gray-50 border rounded p-3 text-gray-700">
              <p className="font-semibold mb-1">
                🔐 How to create App Password
              </p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Use the same Gmail entered above</li>
                <li>Enable 2-Step Verification</li>
                <li>Open App Passwords</li>
                <li>Select App → Mail</li>
                <li>Select Device → Other</li>
                <li>Copy 16-character password</li>
              </ol>
            </div>

            <p className="text-xs text-red-600">
              ⚠️ Do NOT use your Gmail password.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="email"
              placeholder="Gmail Address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <div className="relative">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
