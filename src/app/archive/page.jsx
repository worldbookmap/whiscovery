import Image from "next/image";
import Link from "next/link";
import HeroShell from "@/components/hero-shell";
import { getWhiskyListByDatabaseId } from "@/lib/notion";
import { DATABASE_BOXES } from "@/lib/collections";

export default async function ArchivePage() {
  const boxResults = await Promise.all(
    DATABASE_BOXES.map(async (database) => {
      try {
        const items = await getWhiskyListByDatabaseId(database.id);
        return {
          ...database,
          items,
          errorMessage: "",
        };
      } catch (error) {
        return {
          ...database,
          items: [],
          errorMessage: error.message,
        };
      }
    })
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8">
      <HeroShell />

      <section className="mt-8 space-y-8">
        {boxResults.map((box) => (
          <Link
            key={box.key}
            href={`/collections/${box.key}`}
            className="group block rounded-3xl border border-white/50 bg-white/65 p-5 shadow-soft transition hover:-translate-y-1 hover:border-amber/40 hover:bg-white/80 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="hero-title text-2xl font-semibold text-ink transition group-hover:text-oak">{box.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-ink/75">
              <span className="rounded-full border border-oak/20 px-3 py-1">{box.items.length} entries</span>
              <span className="rounded-full border border-oak/20 px-3 py-1">
                중앙에서 열기
                <span className="ml-2 inline-block transition group-hover:translate-x-1">&gt;</span>
              </span>
            </div>

            {box.errorMessage ? (
              <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-semibold">데이터 로드 실패</p>
                <p className="mt-1 line-clamp-2">{box.errorMessage}</p>
              </div>
            ) : null}

            {!box.errorMessage && box.items.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {box.items.slice(0, 6).map((item) => {
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
                      {showPreview ? (
                        <div className="ml-2 shrink-0 overflow-hidden rounded-xl border border-oak/10 bg-white/80 shadow-sm">
                          <Image
                            src={item.imageUrl}
                            alt={`${item.title} 첫 첨부 사진`}
                            width={72}
                            height={72}
                            quality={45}
                            sizes="72px"
                            className="h-16 w-16 object-cover sm:h-18 sm:w-18"
                            unoptimized
                          />
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </Link>
        ))}
      </section>
    </main>
  );
}