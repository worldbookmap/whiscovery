import HeroShell from "@/components/hero-shell";
import WhiskyMapSection from "@/components/whisky-map-section";
import CollectionPreviewSection from "@/components/collection-preview-section";
import { getWhiskyListByDatabaseId } from "@/lib/notion";
import { DATABASE_BOXES } from "@/lib/collections";

export default async function ArchivePage() {
  const boxResults = await Promise.all(
    DATABASE_BOXES.map(async (database) => {
      try {
        const items = await getWhiskyListByDatabaseId(database.id, { includeContentText: true });
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
  const mapLinkedSources = boxResults.map((box) => ({
    collectionKey: box.key,
    collectionTitle: box.title,
    items: box.items,
  }));

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8">
      <HeroShell />

      <div className="mt-8">
        <WhiskyMapSection linkedSources={mapLinkedSources} />
      </div>

      <section className="mt-8 space-y-8">
        {boxResults.map((box) => (
          <CollectionPreviewSection key={box.key} box={box} />
        ))}
      </section>
    </main>
  );
}