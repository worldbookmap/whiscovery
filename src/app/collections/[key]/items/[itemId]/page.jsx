import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroShell from "@/components/hero-shell";
import { DATABASE_BOXES, getCollectionByKey } from "@/lib/collections";
import { getWhiskyItemDetail, getWhiskyListByDatabaseId } from "@/lib/notion";

export default async function ItemDetailPage({ params }) {
  const collection = getCollectionByKey(params.key);

  if (!collection) {
    notFound();
  }

  const items = await getWhiskyListByDatabaseId(collection.id);
  const item = await getWhiskyItemDetail(collection.id, decodeURIComponent(params.itemId));

  if (!item) {
    notFound();
  }

  const currentIndex = items.findIndex((entry) => entry.id === item.id);
  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8">
      <HeroShell collection={collection} itemTitle={item.title} />

      <section className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-6">
        <div className="rounded-3xl border border-white/50 bg-white/65 p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink/50">Item Detail</p>
              <h2 className="hero-title mt-2 text-3xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-ink/65">{collection.title}</p>
            </div>
            <Link
              href={`/collections/${collection.key}`}
              className="rounded-full border border-oak/20 px-4 py-2 text-sm font-semibold text-oak transition hover:bg-oak hover:text-white"
            >
              컬렉션으로 돌아가기
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {DATABASE_BOXES.map((entry) => {
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
        </div>

        <article className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-soft">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={640}
              height={360}
              quality={20}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-72 w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-oak/10 text-sm text-oak/45">No image</div>
          )}

          <div className="grid gap-6 p-6 md:p-8">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {item.displayFields.map((field) => (
                <div key={field.key} className="rounded-2xl border border-oak/10 bg-white/75 p-4 text-sm text-ink/75">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{field.label}</p>
                  <p className="mt-1 text-base text-ink">{field.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-oak/10 bg-white/75 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">본문</p>
              <div className="mt-3 space-y-4 text-sm leading-7 text-ink/80">
                {item.contentBlocks.length === 0 ? <p>표시할 본문이 없습니다.</p> : null}
                {item.contentBlocks.map((block, index) => {
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
                    return (
                      <div key={`${block.type}-${index}`} className="overflow-hidden rounded-2xl border border-oak/10 bg-white/60">
                        <Image src={block.url} alt={block.caption || item.title} width={640} height={360} quality={20} sizes="(max-width: 768px) 100vw, 768px" className="w-full object-cover" unoptimized />
                        {block.caption ? <p className="px-4 py-3 text-xs text-ink/55">{block.caption}</p> : null}
                      </div>
                    );
                  }

                  return <p key={`${block.type}-${index}`}>{block.text}</p>;
                })}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {previousItem ? (
                <Link
                  href={`/collections/${collection.key}/items/${encodeURIComponent(previousItem.id)}`}
                  className="rounded-2xl border border-oak/15 bg-white/75 p-4 text-sm transition hover:border-oak/35 hover:bg-white"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Previous</p>
                  <p className="mt-2 font-semibold text-ink">{previousItem.title}</p>
                </Link>
              ) : (
                <div className="rounded-2xl border border-oak/10 bg-white/55 p-4 text-sm text-ink/45">이전 항목이 없습니다.</div>
              )}

              {nextItem ? (
                <Link
                  href={`/collections/${collection.key}/items/${encodeURIComponent(nextItem.id)}`}
                  className="rounded-2xl border border-oak/15 bg-white/75 p-4 text-sm transition hover:border-oak/35 hover:bg-white"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Next</p>
                  <p className="mt-2 font-semibold text-ink">{nextItem.title}</p>
                </Link>
              ) : (
                <div className="rounded-2xl border border-oak/10 bg-white/55 p-4 text-sm text-ink/45">다음 항목이 없습니다.</div>
              )}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}