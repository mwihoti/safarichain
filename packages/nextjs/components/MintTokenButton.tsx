"use client";

import Link from "next/link";

export default function MintTicketButton() {
  return (
    <div className="text-center mb-8">
      <Link href="/tickets">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl">
          Get 2026 ETHSafari NFT Ticket
        </button>
      </Link>
      <p className="text-sm text-gray-500 mt-2">0.01 ETH • Gasless Mint • Burnable at Gate</p>
    </div>
  );
}