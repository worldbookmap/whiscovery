"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import distilleries from "../../assets/major_whisky_distilleries.json";

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9\u3131-\u318E\uAC00-\uD7A3\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeDistilleryLabel = (value) => {
  return normalizeText(value)
    .replace(/\bdistillery\b/g, "")
    .replace(/\bthe\b/g, "")
    .replace(/\bwhisky\b/g, "")
    .replace(/\bwhiskey\b/g, "")
    .replace(/\s증류소$/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeHtml = (value) => {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const buildPostHref = (collectionKey, itemId) => {
  return `/collections/${collectionKey}/items/${encodeURIComponent(itemId)}`;
};

const buildItemCorpus = (item) => {
  const values = [item.title, item.contentText, item.searchText, ...(item.displayFields || []).map((field) => field.value), ...(item.filterValues || [])];
  return normalizeText(values.filter(Boolean).join(" "));
};

const buildLinkedPostEntries = (linkedSources) => {
  return (linkedSources || []).flatMap((source) => {
    const collectionKey = source.collectionKey;
    const collectionTitle = source.collectionTitle;
    return (source.items || []).map((item) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl || "",
      collectionKey,
      collectionTitle,
      href: buildPostHref(collectionKey, item.id),
      corpus: buildItemCorpus(item),
    }));
  });
};

const matchDistilleryPosts = (locations, linkedSources) => {
  const items = buildLinkedPostEntries(linkedSources);

  return locations.map((location) => {
    const koKey = normalizeDistilleryLabel(location.name_ko);
    const enKey = normalizeDistilleryLabel(location.name);
    const keys = [koKey, enKey].filter(Boolean);

    const linkedPosts = items.filter((item) => keys.some((key) => key && item.corpus.includes(key)));

    return {
      ...location,
      linkedPosts,
    };
  });
};

const makePopupHtml = (item) => {
  const heading = `<strong style="font-size:14px;">${escapeHtml(item.name_ko || item.name)}</strong><br /><span style="font-size:12px; color:#6b7280;">${escapeHtml(item.name)}</span>`;

  if (!item.linkedPosts?.length) {
    return heading;
  }

  const previewItems = item.linkedPosts.slice(0, 3);
  const cards = previewItems
    .map(
      (post) => `
        <a href="${escapeHtml(post.href)}" style="display:flex; gap:8px; align-items:center; margin-top:8px; padding:7px; border-radius:10px; background:rgba(255,255,255,0.92); border:1px solid rgba(138,90,36,0.16); text-decoration:none;">
          ${
            post.imageUrl
              ? `<img src="${escapeHtml(post.imageUrl)}" alt="" style="width:34px; height:34px; border-radius:8px; object-fit:cover; flex:0 0 auto;" />`
              : `<div style="width:34px; height:34px; border-radius:8px; background:rgba(138,90,36,0.14);"></div>`
          }
          <div style="min-width:0;">
            <div style="font-size:10px; color:#7c5a2d; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;">${escapeHtml(post.collectionTitle)}</div>
            <div style="font-size:12px; color:#1f2937; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(post.title)}</div>
          </div>
        </a>`
    )
    .join("");
  const remainder = item.linkedPosts.length - previewItems.length;
  const extra = remainder > 0 ? `<div style="margin-top:4px; font-size:12px; color:#6b7280;">외 ${remainder}개 기록</div>` : "";

  return `${heading}<div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(17,24,39,0.12); font-size:13px;"><div style="font-weight:700; margin-bottom:2px; color:#7c5a2d;">연결된 게시물</div>${cards}${extra}</div>`;
};

export default function WhiskyMapSection({ linkedSources = [] }) {
  const [query, setQuery] = useState("");
  const [selectedDistillery, setSelectedDistillery] = useState(null);
  const [showAllPins, setShowAllPins] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const [leafletError, setLeafletError] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapInstanceRef = useRef(null);

  const baseLocationList = useMemo(() => {
    return distilleries.map((item) => ({
      ...item,
      latitude: Number(item.latitude ?? item.lat ?? 0),
      longitude: Number(item.longitude ?? item.lng ?? 0),
    }));
  }, []);

  const locationList = useMemo(() => {
    return matchDistilleryPosts(baseLocationList, linkedSources);
  }, [baseLocationList, linkedSources]);

  const visibleLocationList = useMemo(() => {
    if (showAllPins) {
      return locationList;
    }
    return locationList.filter((item) => (item.linkedPosts?.length || 0) > 0);
  }, [locationList, showAllPins]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletReady(Boolean(window.L));
    };
    script.onerror = () => {
      setLeafletError(true);
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current || !window.L || mapInstanceRef.current) {
      return;
    }

    const L = window.L;
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
  }, [leafletReady]);

  useEffect(() => {
    if (!leafletReady || !window.L || !mapInstanceRef.current) {
      return;
    }

    const L = window.L;
    markersRef.current.forEach((marker) => {
      marker.remove();
    });

    const markerLayer = [];
    const prioritizedLocations = [...visibleLocationList].sort((left, right) => {
      const rightScore = right.linkedPosts?.length || 0;
      const leftScore = left.linkedPosts?.length || 0;
      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }
      return String(left.name_ko || left.name).localeCompare(String(right.name_ko || right.name), "ko");
    });

    prioritizedLocations.forEach((item) => {
      if (!Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) {
        return;
      }

      const linkedCount = item.linkedPosts?.length || 0;
      const hasLinkedPosts = linkedCount > 0;
      const pinSize = hasLinkedPosts ? 14 : 10;
      const pinColor = hasLinkedPosts ? "#dc2626" : "#2563eb";
      const pinShadow = hasLinkedPosts ? "0 3px 10px rgba(220,38,38,0.4)" : "0 2px 8px rgba(37,99,235,0.32)";

      const marker = L.marker([item.latitude, item.longitude], {
        zIndexOffset: hasLinkedPosts ? 300 + linkedCount : 0,
        icon: L.divIcon({
          className: "distillery-marker",
          html: `<div style="width:${pinSize}px; height:${pinSize}px; border-radius:999px; background:${pinColor}; border:2px solid #fff; box-shadow:${pinShadow};"></div>`,
          iconSize: [pinSize + 2, pinSize + 2],
          iconAnchor: [Math.round((pinSize + 2) / 2), Math.round((pinSize + 2) / 2)],
        }),
      })
        .addTo(map)
        .bindPopup(makePopupHtml(item));

      marker.__distilleryName = item.name;

      markerLayer.push(marker);
    });

    markersRef.current = markerLayer;
  }, [leafletReady, visibleLocationList]);

  useEffect(() => {
    if (!selectedDistillery) {
      return;
    }

    const isVisible = visibleLocationList.some((item) => item.name === selectedDistillery.name);
    if (!isVisible) {
      setSelectedDistillery(null);
    }
  }, [selectedDistillery, visibleLocationList]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current.length) {
      return;
    }

    const L = window.L;
    const isSelected = Boolean(selectedDistillery);

    markersRef.current.forEach((marker) => {
      const isTarget = Boolean(selectedDistillery && marker.__distilleryName === selectedDistillery.name);

      if (!L) {
        return;
      }

      const shouldDim = isSelected && !isTarget;
      const markerElement = marker.getElement?.();
      if (markerElement) {
        markerElement.style.opacity = shouldDim ? "0.35" : "1";
        markerElement.style.filter = shouldDim ? "grayscale(0.6)" : "none";
      }
    });

    if (!selectedDistillery) {
      return;
    }

    const targetMarker = markersRef.current.find((marker) => {
      return marker.__distilleryName === selectedDistillery.name;
    });

    if (!targetMarker) {
      return;
    }

    const latlng = targetMarker.getLatLng();
    mapInstanceRef.current.flyTo([latlng.lat, latlng.lng], 6, {
      duration: 1.2,
    });
    targetMarker.openPopup();
  }, [selectedDistillery]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return visibleLocationList
      .filter((item) => {
        const haystacks = [item.name, item.name_ko].filter(Boolean);
        return haystacks.some((text) => text.toLowerCase().includes(normalizedQuery));
      })
      .slice(0, 8);
  }, [visibleLocationList, query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const firstMatch = suggestions[0] ?? null;
    setSelectedDistillery(firstMatch);
  };

  const handleQueryChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);

    if (!nextValue.trim()) {
      setSelectedDistillery(null);
    }
  };

  return (
    <section className="w-full rounded-3xl border border-white/50 bg-white/65 p-5 shadow-soft backdrop-blur-xl sm:p-6">
      <div className="mb-4">
        <p className="mb-2 inline-flex rounded-full bg-amber/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-oak">
          Distillery Map
        </p>
        <h2 className="text-2xl font-semibold text-ink">위스키 증류소 지도</h2>
        <p className="mt-2 text-xs text-ink/65">빨강: 연결 게시물 있음 · 파랑: 연결 게시물 없음</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAllPins(false)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !showAllPins
              ? "bg-oak text-white"
              : "border border-oak/20 bg-white/70 text-ink/70 hover:border-oak/35 hover:text-oak"
          }`}
        >
          연결된 핀만
        </button>
        <button
          type="button"
          onClick={() => setShowAllPins(true)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            showAllPins
              ? "bg-oak text-white"
              : "border border-oak/20 bg-white/70 text-ink/70 hover:border-oak/35 hover:text-oak"
          }`}
        >
          전체 보기
        </button>
        <span className="text-xs text-ink/60">
          표시 중: {visibleLocationList.length} / 전체 {locationList.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          id="distillery-search"
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="예: 아벨라워, Aberlour, 아드벡"
          className="w-full rounded-2xl border border-oak/15 bg-white/80 px-4 py-3 text-sm text-ink shadow-sm outline-none ring-0 transition focus:border-amber/50 focus:bg-white"
        />
      </form>

      {query && suggestions.length > 0 ? (
        <ul className="mb-4 divide-y divide-oak/10 overflow-hidden rounded-2xl border border-oak/10 bg-white/85">
          {suggestions.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => {
                  setQuery(`${item.name_ko} · ${item.name}`);
                  setSelectedDistillery(item);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink transition hover:bg-amber/10"
              >
                <span>
                  <span className="block font-semibold">{item.name_ko}</span>
                  <span className="mt-0.5 block text-xs text-ink/60">{item.name}</span>
                </span>
                <span className="text-xs text-oak/70">선택</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="overflow-hidden rounded-[24px] border border-oak/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(247,239,221,0.8))] p-3 sm:p-4">
        <div ref={mapRef} className="h-[320px] w-full overflow-hidden rounded-[20px]" />
        {!leafletReady && !leafletError ? (
          <div className="mt-3 text-sm text-ink/70">지도를 불러오는 중입니다…</div>
        ) : null}
        {leafletError ? (
          <div className="mt-3 text-sm text-red-700">지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>
        ) : null}
      </div>

      {selectedDistillery ? (
        <div className="mt-4 rounded-2xl border border-amber/20 bg-amber/10 p-3 text-sm text-ink">
          선택된 증류소: <span className="font-semibold">{selectedDistillery.name_ko}</span> ({selectedDistillery.name})
          {selectedDistillery.linkedPosts?.length ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-oak/80">연결된 게시물</p>
              {selectedDistillery.linkedPosts.slice(0, 6).map((post) => (
                <div key={`${post.collectionKey}-${post.id}`} className="rounded-xl border border-oak/10 bg-white/70 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-oak/70">{post.collectionTitle}</p>
                  <Link href={post.href} className="mt-1 block text-oak underline decoration-oak/50 underline-offset-2 hover:text-oak/80">
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-oak/10 bg-white/70 p-3 text-sm text-ink/70">
          검색 결과를 선택하면 지도에서 해당 위치로 이동합니다.
        </div>
      )}
    </section>
  );
}
