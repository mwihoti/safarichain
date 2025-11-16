// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import HeroSection from "~~/components/HeroSection";
import WalletControls from "~~/components/WalletControls";
import MintTicketButton from "~~/components/MintTokenButton";
import TweetGrid from "~~/components/TweetGrid";

import TweetModal from "~~/components/TweetModal";
import { useAccount, useWriteContract } from "wagmi";

// Fallback if the static JSON can't be loaded
const staticFallback = { username: "ETHSafari", tweets: [] };

const fetcher = async (url: string) => {
  // Check localStorage cache first
  const cacheKey = `tweet_cache_${url}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      // 5 minutes cache
      return data;
    }
  }

  // Fetch from API
  const res = await fetch(url);
  const data = await res.json();

  // Cache in localStorage
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

  return data;
};

export default function Home() {
  const [username, setUsername] = useState("ETHSafari");
  const [selectedTweet, setSelectedTweet] = useState<any>(null);
  const [likedTweets, setLikedTweets] = useState<Set<string>>(new Set());
  const [onChainComments, setOnChainComments] = useState<Record<string, any[]>>({});
  const [onChainLikes, setOnChainLikes] = useState<Record<string, number>>({});
  const [tweetData, setTweetData] = useState(staticFallback);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);

  const { address, isConnected } = useAccount();

  const fetchLatestTweets = async () => {
    setIsLoadingLatest(true);
    try {
      const data = await fetcher(`/api/tweets?username=${username}`);
      setTweetData(data);
    } catch (error) {
      console.error("Failed to fetch latest tweets:", error);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  // On mount, try to load the local static tweets JSON from public/
  useEffect(() => {
    let mounted = true;
    const loadLocalTweets = async () => {
      try {
        const data = await fetcher("/ethsafari_tweets.json");
        if (mounted && data) setTweetData(data);
      } catch (err) {
        console.warn("Could not load local static tweets:", err);
        // keep fallback
      }
    };

    loadLocalTweets();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!tweetData?.tweets) return;
    const comments = tweetData.tweets.reduce((acc: any, t: any) => ({ ...acc, [t.id]: [] }), {});
    const likes = tweetData.tweets.reduce((acc: any, t: any) => ({ ...acc, [t.id]: 0 }), {});
    setOnChainComments(comments);
    setOnChainLikes(likes);
  }, [tweetData?.tweets]);

  const likeTweet = (id: string) => {
    if (!isConnected || likedTweets.has(id)) return;
    setLikedTweets(new Set(likedTweets).add(id));
    setOnChainLikes(prev => {
      return { ...prev, [id]: (prev[id] || 0) + 1 };
    });
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <HeroSection />
      <WalletControls onUsernameChange={setUsername} />
      {isConnected && <MintTicketButton />}
      <div className="text-center mb-4">
        <button
          onClick={fetchLatestTweets}
          disabled={isLoadingLatest}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoadingLatest ? "Loading..." : "Get Latest Tweets"}
        </button>
      </div>
      <TweetGrid
        tweets={tweetData?.tweets || []}
        onTweetClick={setSelectedTweet}
        onLike={likeTweet}
        likedTweets={likedTweets}
        onChainLikes={onChainLikes}
      />
      <TweetModal
        tweet={selectedTweet}
        open={!!selectedTweet}
        onClose={() => setSelectedTweet(null)}
        comments={onChainComments[selectedTweet?.id] || []}
        onComment={(id, content) => {
          setOnChainComments(prev => ({
            ...prev,
            [id]: [
              ...(prev[id] || []),
              {
                content,
                author: address?.slice(0, 8) + "..." || "You",
                timestamp: Date.now() / 1000,
              },
            ],
          }));
        }}
      />
    </main>
  );
}