export default function HomePage() {
  return (
    <>
      <style>{`
        :root {
          color-scheme: dark;
          font-family: "Inter", "Pretendard", "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background:
            linear-gradient(135deg, rgba(255, 247, 221, 0.12), rgba(245, 158, 11, 0.06)),
            radial-gradient(circle at 20% 20%, rgba(253, 230, 138, 0.14), transparent 28%),
            radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1), transparent 26%),
            linear-gradient(135deg, rgba(255, 250, 240, 0.26), rgba(120, 53, 15, 0.32)),
            url("/assets/bgOpen.jpg") center/cover no-repeat;
          color: #111827;
          overflow: hidden;
          position: relative;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          transform: translateX(-100%);
          animation: shimmer 2.8s ease-in-out infinite;
          pointer-events: none;
        }

        body::after {
          content: "";
          position: fixed;
          inset: -20%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 62%);
          animation: pulse 4s ease-in-out infinite;
          pointer-events: none;
        }

        .landing-main {
          width: min(700px, 100%);
          text-align: center;
          padding: 48px 40px 42px;
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(255, 252, 247, 0.32), rgba(255, 244, 224, 0.2));
          border: 1px solid rgba(17, 24, 39, 0.06);
          box-shadow: 0 22px 62px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.32);
          backdrop-filter: blur(18px);
          animation: cardRise 0.8s ease-out both;
          margin-inline: auto;
        }

        .landing-eyebrow {
          display: inline-block;
          margin-bottom: 16px;
          padding: 7px 13px;
          border-radius: 999px;
          background: rgba(245, 158, 11, 0.16);
          color: #a16207;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .landing-title {
          margin: 0 0 18px;
          font-family: "Grandiflora One", "Playfair Display", Georgia, serif;
          font-size: clamp(1.7rem, 2.8vw, 2.45rem);
          line-height: 1.28;
          letter-spacing: 0.01em;
          color: #111827;
          font-weight: 800;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.52), 0 0 1px rgba(17, 24, 39, 0.18);
        }

        .landing-link {
          display: inline-block;
          padding: 13px 22px;
          border-radius: 999px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b 45%, #d97706);
          color: #fffdf7;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 10px 22px rgba(217, 119, 6, 0.24);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: floatButton 2.4s ease-in-out infinite;
        }

        .landing-link:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 24px rgba(217, 119, 6, 0.32);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.96); }
          50% { opacity: 0.5; transform: scale(1.04); }
        }

        @keyframes cardRise {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes floatButton {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <main className="landing-main">
        <div className="landing-eyebrow">Whiscovery CS</div>
        <h1 className="landing-title">위스키를 아는 것은 하나의 역사를 읽는 것이고, 위스키를 마시는 것은 기분이 좋은 것이다.</h1>
        <a className="landing-link" href="/archive">
          들어가기
        </a>
      </main>
    </>
  );
}
