// components/TweetModal.tsx

"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import { createGaslessSmartAccount } from "~~/utils/gasless";

type Props = {
  tweet: any;
  open: boolean;
  onClose: () => void;
  comments: any[];
  onComment: (id: string, content: string) => void;
};

const CONTRACT = "0xcFe4e9729798591C202559884Ea9FBB5cA90251D" as `0x${string}`;

export default function TweetModal({ tweet, open, onClose, comments, onComment }: Props) {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard: if tweet is null or author is null, render nothing
  if (!tweet || !tweet.author) return null;

  const submit = async () => {
    if (!input.trim() || !walletClient) return;
    setIsSubmitting(true);
    try {
      onComment(tweet.id, input);
      const smartAccountClient = await createGaslessSmartAccount(walletClient);
      await smartAccountClient.writeContract({
        address: CONTRACT,
        abi: [
          {
            inputs: [
              { internalType: "string", name: "_tweetId", type: "string" },
              { internalType: "string", name: "_content", type: "string" },
            ],
            name: "addComment",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "addComment",
        args: [tweet.id, input],
      });
      setInput("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl">
                {/* Author Header */}
                <Dialog.Title className="text-xl font-bold flex items-center gap-3">
                  {tweet.author?.profile_image_url ? (
                    <Image
                      src={tweet.author.profile_image_url}
                      alt={tweet.author.username || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  )}
                  <div>
                    <div>{tweet.author?.name || "Unknown User"}</div>
                    <div className="text-sm text-gray-500">@{tweet.author?.username || "unknown"}</div>
                  </div>
                </Dialog.Title>

                {/* Tweet Text */}
                <p className="mt-4 text-lg">{tweet.text}</p>

                {/* Media */}
                {tweet.media && tweet.media.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {tweet.media.map((m: any, i: number) => (
                      <div key={i}>
                        {m.type === "photo" ? (
                          <Image
                            src={m.url!}
                            alt={`media ${i + 1}`}
                            width={800}
                            height={600}
                            className="rounded-lg w-full"
                          />
                        ) : (
                          <video controls className="w-full rounded-lg">
                            <source src={m.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* On-Chain Comments */}
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-3">On-Chain Comments</h3>
                  {comments.length ? (
                    comments.map((c, i) => (
                      <div key={i} className="border-l-4 border-green-500 pl-4 mb-3 text-sm">
                        <p>{c.content}</p>
                        <p className="text-xs text-gray-500">
                          {c.author} • {new Date(c.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No comments yet. Be the first!</p>
                  )}

                  {/* Comment Input */}
                  {isConnected ? (
                    <div className="flex gap-2 mt-4">
                      <input
                        placeholder="Comment on-chain (gasless NFT)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-3 border rounded-lg"
                      />
                      <button
                        onClick={submit}
                        disabled={isSubmitting || !input.trim()}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Comment"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">Connect wallet to comment</p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="mt-8 w-full py-3 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}