// components/TweetGrid.tsx
import TweetCard from "./TweetCard";

type Tweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: { like_count: number; retweet_count: number; reply_count: number; quote_count: number };
  media?: { type: string; url?: string; width?: number; height?: number }[];
  author?: { name: string; username: string; profile_image_url?: string; verified?: boolean };
};

type Props = {
  tweets: Tweet[];
  onTweetClick: (tweet: Tweet) => void;
  onLike: (id: string) => void;
  likedTweets: Set<string>;
  onChainLikes: Record<string, number>;
};

export default function TweetGrid({ tweets, onTweetClick, onLike, likedTweets, onChainLikes }: Props) {
  if (!tweets || tweets.length === 0) {
    return <p className="text-center text-gray-500">No tweets found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          onClick={() => onTweetClick(tweet)}
          onLike={onLike}
          liked={likedTweets.has(tweet.id)}
          onChainLikes={onChainLikes[tweet.id] || 0}
        />
      ))}
    </div>
  );
}