export default function HeroSection() {
  return (
    <section className="text-center mb-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">SafariChain</h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
        A <strong>decentralized social and ticketing platform</strong> that transforms ETHSafari into a{" "}
        <strong>fully on-chain community experience</strong>. It pulls real-time ETHSafari tweets via twitterapi.io, lets users connect their wallet to comment and like directly on-chain (preserving anonymity), and enables minting of the official 2026 ETHSafari NFT Ticket — burnable at the gate. SafariChain turns every tweet into a discussion thread on the blockchain and makes event access a native Web3 action. <strong>No logins. No data leaks. Just wallets, tweets, and tickets — all on-chain.</strong>
      </p>
    </section>
  );
}