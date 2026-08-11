"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const getIsMobile = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
};

export default function DetailContentBlocks({ contentBlocks = [], itemTitle = "" }) {
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!lightboxImage) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImage]);

  const normalizedBlocks = useMemo(() => {
    return contentBlocks.map((block) => {
      if (block.type !== "image") {
        return block;
      }

      return {
        ...block,
        displayUrl: isMobile ? block.mobileUrl || block.url : block.desktopUrl || block.url,
      };
    });
  }, [contentBlocks, isMobile]);

  return (
    <>
      <div className="mt-3 space-y-4 text-sm leading-7 text-ink/80">
        {normalizedBlocks.length === 0 ? <p>표시할 본문이 없습니다.</p> : null}
        {normalizedBlocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <h3 key={`${block.type}-${index}`} className="hero-title text-xl font-semibold text-ink">
                {block.text}
              </h3>
            );
          }

          if (block.type === "bullet") {
            return (
              <p key={`${block.type}-${index}`} className="pl-4 before:mr-2 before:content-['•']">
                {block.text}
              </p>
            );
          }

          if (block.type === "number") {
            return (
              <p key={`${block.type}-${index}`}>
                {index + 1}. {block.text}
              </p>
            );
          }

          if (block.type === "quote" || block.type === "callout") {
            return (
              <blockquote key={`${block.type}-${index}`} className="rounded-2xl border border-oak/10 bg-oak/5 px-4 py-3 text-ink/70">
                {block.text}
              </blockquote>
            );
          }

          if (block.type === "image") {
            const caption = block.caption || itemTitle;

            return (
              <div key={`${block.type}-${index}`} className="overflow-hidden rounded-2xl border border-oak/10 bg-white/60">
                <button
                  type="button"
                  onClick={() => setLightboxImage({ src: block.originalUrl || block.displayUrl, alt: caption })}
                  className="group block w-full text-left"
                >
                  <Image
                    src={block.displayUrl}
                    alt={caption}
                    width={1200}
                    height={720}
                    sizes="(max-width: 768px) 100vw, 900px"
                    loading="lazy"
                    className="w-full object-cover transition group-hover:scale-[1.01]"
                    unoptimized
                  />
                </button>
                <p className="px-4 pt-2 text-[11px] text-ink/45">이미지를 탭하면 확대해서 볼 수 있습니다.</p>
                {block.caption ? <p className="px-4 py-3 text-xs text-ink/55">{block.caption}</p> : null}
              </div>
            );
          }

          return <p key={`${block.type}-${index}`}>{block.text}</p>;
        })}
      </div>

      {lightboxImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-sm text-white"
          >
            닫기
          </button>
          <div className="max-h-full max-w-5xl overflow-auto" onClick={(event) => event.stopPropagation()}>
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              width={1800}
              height={1200}
              className="h-auto w-full rounded-xl object-contain"
              unoptimized
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
