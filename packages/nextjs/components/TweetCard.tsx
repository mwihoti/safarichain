import Image from "next/image";
import { useAccount } from "wagmi";

type Media = { type: string; url?: string; width?: number; height?: number };
type Tweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: { like_count: number; retweet_count: number };
  media?: Media[];
  author?: { name: string; username: string; profile_image_url?: string; verified?: boolean };
};

type Props = {
  tweet: Tweet;
  onClick: () => void;
  onLike: (id: string) => void;
  liked: boolean;
  onChainLikes: number;
};

export default function TweetCard({ tweet, onClick, onLike, liked, onChainLikes }: Props) {
  const { isConnected } = useAccount();

  // Handle missing author gracefully

  return (
    <article
      className="border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all bg-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        {tweet.author?.profile_image_url ? (
          <Image
            src={tweet.author.profile_image_url}
            alt={tweet.author?.username || ""}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
        )}
        <div>
          <p className="font-bold">{tweet.author?.name || "Unknown User"}</p>
          <p className="text-sm text-gray-600">@{tweet.author?.username || "unknown"}</p>
        </div>
        {tweet.author?.verified && <span className="text-blue-500 text-xs">Verified</span>}
      </div>

      <p className="mb-3">{tweet.text}</p>

      {tweet.media && tweet.media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {tweet.media.slice(0, 4).map((m, i) => (
            <div key={i} className="relative aspect-square">
              {m.type === "photo" && m.url ? (
                <Image src={m.url} alt="" fill className="rounded-md object-cover" />
              ) : (
                <div className="bg-gray-200 rounded-md flex items-center justify-center w-full h-full">
                  <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-500">
        <span>{new Date(tweet.created_at).toLocaleDateString()}</span>
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(tweet.id);
            }}
            disabled={!isConnected || liked}
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-500"}`}
          >
            Heart {onChainLikes}
          </button>
          <span>Retweet {tweet.public_metrics?.retweet_count || 0}</span>
        </div>
      </div>
    </article>
  );
}