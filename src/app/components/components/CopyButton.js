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
    const res = await fetch("/api/invite/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: uId,
      }),
    });

    const data = await res.json();

    await navigator.clipboard.writeText(data.link);
    alert("Invite link copied (expires in 1 hour)");
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
