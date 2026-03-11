import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function InviteLink({ uId }) {
  const [copied, setCopied] = useState(false);

  const inviteLink = `${process.env.NEXT_PUBLIC_URL_LINK}/contacts/create?uid=${uId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const generateInviteLink = async () => {
    try {
      const res = await fetch("/api/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: uId,
        }),
      });

      if (!res.ok) {
        console.error("API error:", res.status);
        alert("Failed to generate invite link");
        return;
      }

      const data = await res.json();

      if (!data.link) {
        alert("Invite link not received");
        return;
      }

      await navigator.clipboard.writeText(data.link);

      alert(
        `Invite link copied (expires in ${process.env.NEXT_PUBLIC_EXPIRE_TIME} Min)`,
      );
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <p
      onClick={generateInviteLink}
      className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600 select-none"
    >
      Invite Link
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-blue-600" />
      )}
    </p>
  );
}
