export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/55 bg-white/75 p-8 text-center shadow-soft backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-oak/15 border-t-oak" />
        <p className="mt-5 text-lg font-semibold text-ink">위스키 정보를 불러오는 중이에요</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">잠시만 기다려 주세요. 조금만 더 지나면 컬렉션이 열립니다.</p>
      </div>
    </main>
  );
}
