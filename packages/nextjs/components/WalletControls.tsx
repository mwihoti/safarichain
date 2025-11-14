"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export default function WalletControls({ onUsernameChange }: { onUsernameChange: (u: string) => void }) {
  const [username, setUsername] = useState("ETHSafari");

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex gap-2 w-full md:w-auto">
        <input
          placeholder="X username (e.g., ETHSafari)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={() => onUsernameChange(username)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Load
        </button>
      </div>
      <ConnectButton />
    </div>
  );
}