import Image from "next/image";

type TeamMemberProps = {
  name: string;
  role: string;
  initials: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
};

export default function TeamMember({
  name,
  role,
  initials,
  bio,
  photo,
  linkedin,
  twitter,
}: TeamMemberProps) {
  return (
    <article className="rounded-lg border border-[#1E3A5F] bg-[#0D1B3E] p-6">
      <div className="flex items-center gap-4">
        {photo ? (
          <span className="relative size-32 shrink-0 overflow-hidden rounded-full ring-1 ring-[#1E3A5F]">
            <Image
              src={photo}
              alt={name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="flex size-32 shrink-0 items-center justify-center rounded-full bg-[#00C9A7]/15 text-lg font-bold text-[#00C9A7]"
          >
            {initials}
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold text-white">{name}</h2>
          <p className="text-sm font-medium text-[#00C9A7]">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-justify text-sm leading-relaxed text-slate-400">
        {bio}
      </p>

      {linkedin || twitter ? (
        <div className="mt-5 flex items-center gap-4">
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="text-slate-400 transition-colors hover:text-[#00C9A7]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="size-5"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
          ) : null}
          {twitter ? (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on X`}
              className="text-slate-400 transition-colors hover:text-[#00C9A7]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="size-5"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
