"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeroShell({ collection, itemTitle }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [{ label: "홈", href: "/" }];

  if (pathname === "/archive") {
    crumbs.push({ label: "아카이브", href: "/archive", current: true });
  } else if (segments[0] === "collections") {
    crumbs.push({ label: "컬렉션", href: "/archive" });

    if (collection) {
      crumbs.push({ label: collection.title, href: `/collections/${collection.key}`, current: !itemTitle });
    }

    if (itemTitle) {
      crumbs.push({ label: itemTitle, current: true });
    }
  }

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/65 p-8 shadow-soft sm:p-12"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 252, 247, 0.78), rgba(255, 244, 224, 0.52)), url("/assets/bgMain.jpeg")',
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber/20 blur-xl" />
      <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-oak/20 blur-xl" />
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-ink/70">
          {crumbs.map((crumb, index) => {
            const isCurrent = crumb.current || index === crumbs.length - 1;

            return (
              <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-2">
                {isCurrent ? (
                  <span className="truncate font-semibold text-oak">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="truncate transition hover:text-oak">
                    {crumb.label}
                  </Link>
                )}
                {index < crumbs.length - 1 ? <span className="shrink-0 text-ink/35">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="inline-flex items-center gap-2 rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold tracking-wide text-oak">
          우리들의 기록 창고
        </p>
        <a
          href="https://speckled-people-03c.notion.site/WhiscoveryCS-e080da6ef9774da8b8f5a1fcdb260c2f?pvs=74"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-sky-300 bg-sky-200 px-3 py-1 text-xs font-semibold tracking-wide text-black transition hover:border-sky-400 hover:bg-sky-300"
        >
          노션바로가기
        </a>
      </div>
      <Link href="/" className="hero-title inline-block text-4xl font-semibold leading-tight text-ink transition hover:text-oak sm:text-5xl">
        WhiscoveryCS
      </Link>
      <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink/80 sm:text-base">
        {"매순간 취해있지 않으면 당신은 최선을 다 하지 않은 것이니… 마시라. 형제들이여.\n날아가는 시간이여, 이 술을 한 잔 마시게나."}
      </p>
    </section>
  );
}