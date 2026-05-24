import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import TeamMember from "@/components/TeamMember";

export const metadata: Metadata = {
  title: "Team · Elostreams",
  description:
    "Meet the founders building Elostreams — real-time, voice-preserving translation for live streams.",
};

const TEAM = [
  {
    name: "John C. Akisin",
    role: "Co-Founder & CEO",
    initials: "JA",
    photo: "/headshot.png",
    linkedin:
      "https://www.linkedin.com/in/cletus-john-akisin/",
    twitter: "https://x.com/AkisinCJ",
    bio: "John is a systems engineer and researcher with a PhD in Mechanical Engineering and more than half a decade of experience in advanced R&D and technical consulting. He currently serves as a Senior Consulting Engineer at a leading UK advanced technology consultancy, where he delivers mission-critical engineering solutions for complex systems. His expertise spans systems engineering, advanced modelling, technical strategy and high-performance problem solving, bringing deep operational and analytical leadership to Elostreams.",
  },
  {
    name: "Oluwasegun D. Adeolu",
    role: "Co-Founder & CTO",
    initials: "OA",
    photo: "/headshots.png",
    linkedin: "https://www.linkedin.com/in/oluwasegunadeolu/",
    twitter: "https://x.com/AdeoluOluwaseg3",
    bio: "Oluwasegun is a software engineer and infrastructure builder with over 5 years of experience developing scalable web, mobile and backend systems. Before transitioning fully into software engineering, he worked as an interpreter — an experience that exposed him firsthand to the global communication barriers that inspired Elostreams. He has contributed to high-impact banking applications tied to major investment banking growth milestones and now leads the architecture, AI infrastructure and real-time streaming systems powering Elostreams’ multilingual communication platform.",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#1E3A5F] px-6 py-5 md:px-10">
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
            className="h-8 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-400 transition-colors hover:text-[#00C9A7]"
        >
          ← Back
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <p className="text-xs font-semibold tracking-widest text-[#00C9A7] uppercase">
          The Team
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Meet the founders
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-400">
          The people building real-time, voice-preserving translation for live
          streams.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TEAM.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </div>
    </main>
  );
}
