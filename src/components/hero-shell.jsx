export default function HeroShell() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/65 p-8 shadow-soft sm:p-12">
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber/20 blur-xl" />
      <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-oak/20 blur-xl" />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="inline-flex items-center gap-2 rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold tracking-wide text-oak">
          우리들의 기록 창고
        </p>
        <a
          href="https://www.notion.so/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-oak/15 bg-white/75 px-3 py-1 text-xs font-semibold tracking-wide text-oak transition hover:border-oak/35 hover:bg-white"
        >
          노션바로가기
        </a>
      </div>
      <h1 className="hero-title text-4xl font-semibold leading-tight text-ink sm:text-5xl">WhiscoveryCS</h1>
      <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink/80 sm:text-base">
        {"매순간 취해있지 않으면 당신은 최선을 다 하지 않은 것이니… 마시라. 형제들이여.\n날아가는 시간이여, 이 술을 한 잔 마시게나."}
      </p>
    </section>
  );
}