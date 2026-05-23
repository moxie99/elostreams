import HeroPanel from "@/components/HeroPanel";
import FeedPanel from "@/components/FeedPanel";

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-1 md:h-screen md:grid-cols-[3fr_2fr] md:overflow-hidden">
      {/* Left: fixed full-height cinematic hero (60%) */}
      <HeroPanel />
      {/* Right: independently scrollable content feed (40%) */}
      <FeedPanel />
    </main>
  );
}
