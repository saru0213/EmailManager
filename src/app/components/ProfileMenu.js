"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const ref = useRef(null);


  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.userId) return;

      const snap = await getDoc(doc(db, "users", user.userId));
      if (snap.exists()) setProfile(snap.data());
    };

    fetchUser();
  }, [user?.userId]);

  
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await onLogout(); 
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
      >
        {profile?.name?.charAt(0).toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-800">
              {profile?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email || user.userId}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
