"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;

export default function CollectionBrowser({ items, collection, collections }) {
  const [query, setQuery] = useState("");
  const [facetFilter, setFacetFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredQuery = useDeferredValue(query);

  const filterOptions = useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.filterValues || []).filter(Boolean))).sort((left, right) =>
      left.localeCompare(right, "ko")
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFacet = facetFilter === "all" || (item.filterValues || []).includes(facetFilter);
      const matchesQuery = !normalizedQuery || (item.searchText || "").includes(normalizedQuery);

      return matchesFacet && matchesQuery;
    });
  }, [deferredQuery, facetFilter, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, facetFilter, collection.key]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredItems]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-white/50 bg-white/65 p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink/50">Archiving Detail</p>
            <h2 className="hero-title mt-2 text-3xl font-semibold text-ink">{collection.title}</h2>
          </div>
          <Link
            href="/archive"
            className="rounded-full border border-oak/20 px-4 py-2 text-sm font-semibold text-oak transition hover:bg-oak hover:text-white"
          >
            아카이빙 목록으로
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {collections.map((entry) => {
            const active = entry.key === collection.key;

            return (
              <Link
                key={entry.key}
                href={`/collections/${entry.key}`}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-oak text-white"
                    : "border border-oak/20 bg-white/70 text-ink/75 hover:border-oak/35 hover:text-oak"
                }`}
              >
                {entry.title}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="제목과 표시 정보 검색"
            className="rounded-2xl border border-oak/15 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-oak/40"
          />
          <select
            value={facetFilter}
            onChange={(event) => setFacetFilter(event.target.value)}
            className="rounded-2xl border border-oak/15 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-oak/40"
          >
            <option value="all">모든 {collection.filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-oak/15 bg-white/55 px-4 py-3 text-sm text-ink/70">
        {filteredItems.length} entries shown
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pagedItems.map((item) => (
          <Link
            key={item.id}
            href={`/collections/${collection.key}/items/${encodeURIComponent(item.id)}`}
            className="shelf-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-4 shadow-soft transition hover:-translate-y-1 hover:border-amber/30"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={640}
                height={320}
                className="h-40 w-full rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-xl bg-oak/10 text-sm text-oak/50">
                No image
              </div>
            )}

            <h3 className="mt-4 line-clamp-1 text-lg font-semibold text-ink">{item.title}</h3>

            <div className="mt-3 space-y-2 text-sm text-ink/80">
              {(item.displayFields || []).map((field) => (
                <p key={field.key} className="line-clamp-2 leading-relaxed">
                  <span className="mr-2 text-ink/45">{field.label}</span>
                  {field.value}
                </p>
              ))}
            </div>

            <span className="mt-auto pt-4 text-sm font-semibold text-oak">웹 상세로 보기</span>
          </Link>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-center justify-start gap-2 sm:justify-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
            const active = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-oak text-white"
                    : "border border-oak/20 bg-white/75 text-ink/70 hover:border-oak/35 hover:text-oak"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          </div>
        </div>
      ) : null}
    </section>
  );
}