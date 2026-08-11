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
                  <Image
                    src={block.displayUrl}
                    alt={caption}
                    width={1200}
                    height={720}
                    sizes="(max-width: 768px) 100vw, 900px"
                    loading="lazy"
                    className="w-full object-cover"
                    unoptimized
                  />
                {block.caption ? <p className="px-4 py-3 text-xs text-ink/55">{block.caption}</p> : null}
              </div>
            );
          }

          return <p key={`${block.type}-${index}`}>{block.text}</p>;
        })}
      </div>
    </>
  );
}
