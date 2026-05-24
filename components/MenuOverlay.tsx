"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Platforms", href: "#for-platforms" },
  { label: "Team", href: "/team" },
  { label: "Early Access", href: "#early-access" },
  { label: "Investor Deck", href: "#raising" },
  { label: "Contact", href: "mailto:adeolusegun1000@gmail.com" },
];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  // Close on Escape and lock background scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu-overlay"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 bg-[#0A0E1A]"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:top-8 md:right-8"
          >
            <X className="size-7" />
          </button>

          <nav className="flex h-full flex-col items-center justify-center gap-7">
            {MENU_ITEMS.map((item) => {
              const className =
                "text-3xl font-bold text-white transition-colors hover:text-[#00C9A7] md:text-4xl";
              // Internal routes use Next Link for client-side navigation;
              // in-page anchors and mailto: stay as plain links.
              return item.href.startsWith("/") ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={className}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={className}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
