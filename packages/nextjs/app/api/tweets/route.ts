import { NextResponse } from "next/server";

const API_BASE = "https://api.twitterapi.io/twitter/user/last_tweets";
const API_KEY = process.env.TWITTERAPI_IO_KEY!;

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; ts: number }>();

type Media = { type: string; url?: string; width?: number; height?: number };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get('username') ?? 'ETHSafari').replace(/^@/, '');
  const cacheKey = username;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `${API_BASE}?userName=${encodeURIComponent(username)}`;
    console.log('Fetching tweets for', username, 'url:', url);
    const res = await fetch(url, {
      headers: { 'X-API-Key': API_KEY },
    });

    console.log('Response status:', res.status);
    if (!res.ok) {
      const txt = await res.text();
      console.error('API error:', txt);
      throw new Error(`twitterapi.io ${res.status}: ${txt}`);
    }

    const json = await res.json();
    console.log('API response:', json);
    if (json.status !== 'success') throw new Error(json.msg ?? 'API error');

    const tweets = (json.data.tweets ?? []).map((t: any) => {
      // ---- Extract media ----
      let media: Media[] = [];
      if (t.extendedEntities?.media) {
        media = t.extendedEntities.media.map((m: any) => ({
          type: m.type,
          url: m.media_url_https || m.video_info?.variants?.[0]?.url, // video URL
          preview_image_url: m.media_url_https,
          width: m.original_info?.width,
          height: m.original_info?.height,
        }));
      } else if (t.card) {
        // Parse card images (e.g., linked previews)
        const binding = t.card.binding_values || {};
        const imgKeys = Object.keys(binding).filter(k => k.includes('image') && binding[k].image_value);
        if (imgKeys.length) {
          media = imgKeys.map(k => ({
            type: 'photo',
            url: binding[k].image_value.url,
            width: binding[k].image_value.width,
            height: binding[k].image_value.height,
          }));
        }
      }

      return {
        id: t.id,
        text: t.text,
        created_at: t.createdAt,
        public_metrics: {
          like_count: t.likeCount,
          retweet_count: t.retweetCount,
          reply_count: t.replyCount,
          quote_count: t.quoteCount,
        },
        media, // now populated
        author: {
          name: t.author.name,
          username: t.author.userName,
          profile_image_url: t.author.profilePicture,
          verified: t.author.isBlueVerified,
        },
      };
    });

    const payload = { username, tweets, pin_tweet: json.data.pin_tweet };
    cache.set(cacheKey, { data: payload, ts: Date.now() });
    return NextResponse.json(payload);
  } catch (err: any) {
    console.error('[twitterapi.io]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}                                                                                                            