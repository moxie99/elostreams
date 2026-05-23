import Image from "next/image";
import Link from "next/link";

// Cinematic hero still. Swap this URL for your own asset (or a local /public image)
// any time — the navy gradient beneath always shows if the photo fails to load.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80";

export default function HeroPanel() {
  return (
    <section className="relative h-[50vh] w-full overflow-hidden md:h-full">
      {/* Base navy gradient — always visible, and the fallback if the photo fails */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0D1B3E] to-[#0A0E1A]"
      />
      {/* Cinematic photo layer */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      {/* Dark overlay so text is always readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/70 to-[#0A0E1A]/30"
      />

      {/* Wordmark — top-left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link
          href="/"
          aria-label="Elostreams home"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo-mark.png"
            alt="Elostreams"
            width={832}
            height={220}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>
      </div>

      {/* Headline — bottom-left */}
      <div className="absolute right-6 bottom-8 left-6 md:right-10 md:bottom-12 md:left-10">
        <h1 className="text-5xl leading-tight font-bold text-white md:text-7xl">
          Hear every stream
          <br />
          in your language.
        </h1>
        <p className="mt-4 text-sm font-medium text-[#00C9A7] md:mt-6 md:text-base">
          Real-time translation in the streamer&apos;s own voice. No setup. No
          barriers.
        </p>
      </div>
    </section>
  );
}
