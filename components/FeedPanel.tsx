"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FeedCard from "@/components/FeedCard";
import MenuOverlay from "@/components/MenuOverlay";
import WaitlistForm from "@/components/WaitlistForm";

// Investor pitch deck — opens in a new tab from the "Raising" card.
const PITCH_DECK_URL = "https://docsend.com/view/arrdhdqhdsz9kjks";

function LiveDot() {
  return (
    <span className="relative inline-flex size-2.5" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
    </span>
  );
}

export default function FeedPanel() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col bg-[#0A0E1A] scroll-smooth md:overflow-y-auto">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1E3A5F] bg-[#0A0E1A]/80 px-5 py-4 backdrop-blur">
        <Badge
          variant="outline"
          className="border-[#00C9A7]/50 bg-transparent tracking-widest text-[#00C9A7] uppercase"
        >
          Coming Soon
        </Badge>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="gap-1.5 text-white hover:bg-white/10 hover:text-white"
        >
          <span className="text-xs font-semibold tracking-widest">MENU</span>
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Cards feed */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <FeedCard
          id="what-we-do"
          label="What We Do"
          title="Elostreams translates live streams in real time"
          titleClassName="text-2xl"
          description="Viewers hear any streamer in their own language, in the streamer's own voice."
          className="sm:col-span-2"
        />

        <FeedCard
          id="how-it-works"
          label="How It Works"
          title="Capture → Transcribe → Translate → Synthesise"
          description="Powered by Whisper, DeepL, and ElevenLabs. Under 1 second on GPU."
        />

        <FeedCard
          id="languages"
          label="Languages"
          title="10 languages at launch"
          description="English · French · Spanish · German · Portuguese · Arabic · Hindi · Chinese · Japanese · Yoruba"
        />

        <FeedCard
          id="for-platforms"
          label="For Platforms"
          title="Drop-in widget. Zero streamer friction."
          description="License our SDK. Your viewers pick their language. Done."
        />

        <FeedCard
          id="status"
          label="Status"
          title={
            <span className="inline-flex items-center gap-2.5">
              MVP confirmed working
              <LiveDot />
            </span>
          }
          description="Live translations running on YouTube streams today across 4 languages."
        />

        <FeedCard
          id="early-access"
          label="Get Early Access"
          className="sm:col-span-2"
        >
          <WaitlistForm />
        </FeedCard>

        <FeedCard
          id="raising"
          label="Raising"
          description="We are raising our Pre-Seed round. UK incorporated. If you are an investor, we would love to talk."
          className="sm:col-span-2"
        >
          <a
            href={PITCH_DECK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-[#00C9A7] transition-opacity hover:opacity-80"
          >
            View our pitch deck →
          </a>
        </FeedCard>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
