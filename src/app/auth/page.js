"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidGmail(loginEmail)) {
      return alert("Please enter a valid Gmail address.");
    }

    if (!isValidPassword(loginPassword)) {
      return alert("Password must be at least 8 characters.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert(`Welcome ${data.user.name}`);
        setLoginEmail("");
        setLoginPassword("");
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

    if (!isValidGmail(signupEmail)) {
      return alert("Please enter a valid Gmail address.");
    }

    if (!isValidPassword(signupPassword)) {
      return alert("Password must be at least 8 characters.");
    }

    if (signupPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

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
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
        setActiveTab("login");
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
              className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
              required
            />
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
              className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
              required
            />
            <input
              type="email"
              placeholder="Gmail Address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
              required
            />
            <div className="relative">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password (min 8 chars)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border text-gray-900 rounded placeholder-gray-400"
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
