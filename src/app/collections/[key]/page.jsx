import { notFound } from "next/navigation";
import CollectionBrowser from "@/components/collection-browser";
import HeroShell from "@/components/hero-shell";
import { DATABASE_BOXES, getCollectionByKey } from "@/lib/collections";
import { getWhiskyListByDatabaseId } from "@/lib/notion";

export default async function CollectionDetailPage({ params }) {
  const collection = getCollectionByKey(params.key);

  if (!collection) {
    notFound();
  }

  let items = [];
  let errorMessage = "";

  try {
    items = await getWhiskyListByDatabaseId(collection.id);
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8">
        <HeroShell />
        <section className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-6">
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">데이터 로드 실패</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8">
      <HeroShell collection={collection} />
      <CollectionBrowser items={items} collection={collection} collections={DATABASE_BOXES} />
    </main>
  );
}