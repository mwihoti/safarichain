import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500 text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">SafariChain</h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-md">
          The decentralized social platform for <strong>ETHSafari 2026</strong> — where tweets become on-chain
          discussions, likes and comments are gasless, and tickets are NFTs. Join the future of blockchain events in
          Africa.
        </p>
        <div className="mb-8">
          <p className="text-lg md:text-xl font-semibold">📅 March 2026 | Nairobi, Kenya</p>
          <p className="text-md md:text-lg">🌍 Building the decentralized future together</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tickets"
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Get Your NFT Ticket
          </Link>
          <Link
            href="/"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-orange-600 transition-colors"
          >
            Explore Tweets
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
