"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function PreviewImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="ml-2 shrink-0 overflow-hidden rounded-xl border border-oak/10 bg-white/80 shadow-sm">
      {!isLoaded ? (
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-[linear-gradient(110deg,rgba(245,158,11,0.14)_0%,rgba(255,255,255,0.75)_45%,rgba(245,158,11,0.14)_90%)] bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite] sm:h-14 sm:w-14">
          <div className="h-4 w-4 rounded-full bg-oak/25" />
        </div>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        quality={20}
        sizes="48px"
        className={`h-12 w-12 object-cover transition-opacity duration-300 sm:h-14 sm:w-14 ${isLoaded ? "block opacity-100" : "hidden opacity-0"}`}
        priority={false}
        loading="lazy"
        unoptimized
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

function PreviewCardSkeleton() {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 p-4">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-24 rounded-full bg-[linear-gradient(110deg,rgba(180,83,9,0.16)_0%,rgba(255,247,237,0.95)_45%,rgba(180,83,9,0.16)_90%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full rounded-full bg-[linear-gradient(110deg,rgba(245,158,11,0.12)_0%,rgba(255,250,240,0.95)_45%,rgba(245,158,11,0.12)_90%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />
          <div className="h-3 w-3/4 rounded-full bg-[linear-gradient(110deg,rgba(245,158,11,0.12)_0%,rgba(255,250,240,0.95)_45%,rgba(245,158,11,0.12)_90%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
      <div className="ml-2 h-12 w-12 rounded-xl bg-[linear-gradient(110deg,rgba(180,83,9,0.16)_0%,rgba(255,247,237,0.95)_45%,rgba(180,83,9,0.16)_90%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite] sm:h-14 sm:w-14" />
    </div>
  );
}

const getItemsPerRow = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.matchMedia("(min-width: 1024px)").matches) {
    return 3;
  }

  if (window.matchMedia("(min-width: 640px)").matches) {
    return 2;
  }

  return 1;
};

export default function CollectionPreviewSection({ box }) {
  const [itemsPerRow, setItemsPerRow] = useState(1);
  const [visibleCount, setVisibleCount] = useState(0);
  const visibleItems = box.items.slice(0, visibleCount);
  const hasMoreItems = visibleCount < box.items.length;
  const isLoading = visibleCount === 0 && !box.errorMessage;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateLayout = () => {
      const nextItemsPerRow = getItemsPerRow();
      setItemsPerRow(nextItemsPerRow);
      setVisibleCount((prev) => {
        if (prev === 0) {
          return Math.min(nextItemsPerRow * 2, box.items.length);
        }
        return Math.min(prev, box.items.length);
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [box.items.length]);

  return (
    <section className="group rounded-3xl border border-white/50 bg-white/65 p-5 shadow-soft transition hover:-translate-y-1 hover:border-amber/40 hover:bg-white/80 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href={`/collections/${box.key}`} className="hero-title text-2xl font-semibold text-ink transition group-hover:text-oak">
          {box.title}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/75">
        <span className="rounded-full border border-emerald-300 bg-emerald-200 px-3 py-1 text-black">{box.items.length}개의 기록들</span>
        <Link href={`/collections/${box.key}`} className="rounded-full border border-oak/20 px-3 py-1">
          기록 모두 보기
          <span className="ml-2 inline-block transition group-hover:translate-x-1">&gt;</span>
        </Link>
      </div>

      {box.errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">데이터 로드 실패</p>
          <p className="mt-1 line-clamp-2">{box.errorMessage}</p>
        </div>
      ) : null}

      {!box.errorMessage ? (
        <>
          {isLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <PreviewCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          {!isLoading && box.items.length > 0 ? (
            <>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => {
                  const showPreview = Boolean(item.imageUrl);

                  return (
                    <Link
                      key={`${box.key}-${item.id}`}
                      href={`/collections/${box.key}/items/${encodeURIComponent(item.id)}`}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 transition hover:-translate-y-1 hover:border-amber/30 hover:bg-white"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-ink">{item.title}</p>
                        <div className="mt-2 space-y-1 text-xs leading-relaxed text-ink/70">
                          {(item.displayFields || []).slice(0, 2).map((field) => (
                            <p key={field.key} className="line-clamp-1">
                              <span className="mr-1 text-ink/45">{field.label}</span>
                              {field.value}
                            </p>
                          ))}
                        </div>
                      </div>
                      {showPreview ? <PreviewImage src={item.imageUrl} alt={`${item.title} 첫 첨부 사진`} /> : null}
                    </Link>
                  );
                })}
              </div>

              {hasMoreItems ? (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + itemsPerRow, box.items.length))}
                    className="group inline-flex items-center justify-center rounded-full border border-oak/20 bg-white/80 px-4 py-2 text-sm font-semibold text-oak/85 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/35 hover:bg-white hover:text-oak active:translate-y-0"
                  >
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-amber/70 transition group-hover:scale-125" />
                    더 보기
                    <span className="ml-2 h-1.5 w-1.5 rounded-full bg-amber/70 transition group-hover:scale-125" />
                  </button>
                </div>
              ) : null}
            </>
          ) : null}

          {!isLoading && box.items.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-oak/10 bg-white/70 py-6 text-center text-sm text-ink/70">
              아직 보여줄 기록이 없습니다.
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
