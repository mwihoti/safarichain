// app/tickets/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import { createGaslessSmartAccount } from "~~/utils/gasless";
import html2canvas from "html2canvas";

type Ticket = {
  tokenId: number;
  owner: string;
  username: string;
  mintedAt: number;
};

export default function TicketsPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [username, setUsername] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Load user tickets from localStorage
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`tickets_${address}`);
      if (stored) {
        setUserTickets(JSON.parse(stored));
      }
    }
  }, [address]);

  const mintTicket = async () => {
    if (!username.trim() || !walletClient) return;
    setIsMinting(true);
    try {
      const smartAccountClient = await createGaslessSmartAccount(walletClient);
      await smartAccountClient.writeContract({
        address: "0xBDc155d3BF08c155Ba77d272cc56DDb702CfB8A3", // Update with deployed contract address
        abi: [
          {
            inputs: [{ internalType: "string", name: "username", type: "string" }],
            name: "mintTicket",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "mintTicket",
        args: [username],
        value: BigInt(10**16), // 0.01 ETH
      });

      // Simulate adding to localStorage
      const newTicket: Ticket = {
        tokenId: Date.now(), // Mock tokenId
        owner: address!,
        username,
        mintedAt: Date.now(),
      };
      const updatedTickets = [...userTickets, newTicket];
      setUserTickets(updatedTickets);
      localStorage.setItem(`tickets_${address}`, JSON.stringify(updatedTickets));
      setUsername("");
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const downloadTicket = async (ticket: Ticket) => {
    const ticketElement = document.getElementById(`ticket-${ticket.tokenId}`);
    if (ticketElement) {
      const canvas = await html2canvas(ticketElement);
      const link = document.createElement("a");
      link.download = `ETHSafari2026_Ticket_${ticket.tokenId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-500 to-green-600">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Image
            src="/ethsafari-logo.png" // Add your logo
            alt="ETHSafari 2026"
            width={200}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-white mb-2">ETHSafari 2026 Tickets</h1>
          <p className="text-xl text-white/90">Your NFT Pass to the Future of Blockchain in Africa</p>
        </div>

        {!isConnected ? (
          <div className="text-center">
            <p className="text-white text-lg">Connect your wallet to purchase tickets</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Mint Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Get Your NFT Ticket</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg border-0 bg-white/20 text-white placeholder-white/70"
                />
                <button
                  onClick={mintTicket}
                  disabled={isMinting || !username.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isMinting ? "Minting..." : "Mint Ticket (0.01 ETH)"}
                </button>
              </div>
            </div>

            {/* User's Tickets */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Tickets</h2>
              {userTickets.length === 0 ? (
                <p className="text-white/70">No tickets yet. Mint your first one above!</p>
              ) : (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <div
                      key={ticket.tokenId}
                      id={`ticket-${ticket.tokenId}`}
                      className="bg-white rounded-lg p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">ETHSafari 2026 Ticket</h3>
                          <p className="text-gray-600">Token ID: {ticket.tokenId}</p>
                        </div>
                        <Image
                          src="/ethsafari-logo.png"
                          alt="ETHSafari"
                          width={60}
                          height={30}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Owner</p>
                          <p className="font-mono text-sm">{ticket.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="font-bold">@{ticket.username}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Minted: {new Date(ticket.mintedAt).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => downloadTicket(ticket)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}