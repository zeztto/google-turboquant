import { reportData } from "@/content/report";

function HeroStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="hero-stat">
      <dt className="hero-stat__label">{label}</dt>
      <dd className="hero-stat__value">{value}</dd>
      <p className="hero-stat__note">{note}</p>
    </div>
  );
}

function SectionCard({
  label,
  title,
  summary,
  bullets,
  analogy,
  source,
}: (typeof reportData.sections)[number]) {
  return (
    <article className="section-card">
      <header className="section-card__header">
        <p className="section-card__label">{label}</p>
        <h3 className="section-card__title">{title}</h3>
        <p className="section-card__summary">{summary}</p>
      </header>
      <ul className="section-card__list">
        {bullets.map((bullet) => (
          <li key={bullet} className="section-card__item">
            {bullet}
          </li>
        ))}
      </ul>
      {analogy ? (
        <p className="section-card__analogy">
          <strong>쉽게 보면:</strong> {analogy}
        </p>
      ) : null}
      <p className="section-card__source">근거: {source}</p>
    </article>
  );
}

export default function Page() {
  return (
    <main className="report-page">
      <article className="report-shell">
        <header className="hero">
          <div className="hero__copy">
            <p className="hero__eyebrow">TurboQuant Research Report</p>
            <h1 className="hero__title">{reportData.title}</h1>
            <p className="hero__subtitle">{reportData.subtitle}</p>
            <p className="hero__intro">{reportData.intro}</p>
            <div className="hero__callout">{reportData.heroTakeaway}</div>
          </div>
          <dl className="hero__stats">
            {reportData.heroStats.map((item) => (
              <HeroStat
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </dl>
        </header>

        <section className="report-section" aria-labelledby="overview-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">맥락</p>
            <h2 id="overview-title" className="section-heading__title">
              먼저 잡아야 할 큰 그림
            </h2>
          </div>
          <div className="overview-grid">
            {reportData.overviewCards.map((card) => (
              <article key={card.title} className="overview-card">
                <h3 className="overview-card__title">{card.title}</h3>
                <p className="overview-card__body">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="report-section" aria-labelledby="timeline-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">연표</p>
            <h2 id="timeline-title" className="section-heading__title">
              기술이 이어진 순서
            </h2>
          </div>
          <ol className="timeline">
            {reportData.timeline.map((item) => (
              <li key={`${item.date}-${item.title}`} className="timeline__item">
                <p className="timeline__date">{item.date}</p>
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__note">{item.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="report-section" aria-labelledby="comparison-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">비교</p>
            <h2 id="comparison-title" className="section-heading__title">
              세 기법을 같은 기준으로 보면
            </h2>
          </div>
          <div className="table-wrap">
            <table className="comparison-table">
              <caption className="sr-only">
                QJL, PolarQuant, TurboQuant 비교표
              </caption>
              <thead>
                <tr>
                  <th scope="col">방법</th>
                  <th scope="col">직접 겨냥한 대상</th>
                  <th scope="col">핵심 아이디어</th>
                  <th scope="col">강점</th>
                  <th scope="col">주의점</th>
                </tr>
              </thead>
              <tbody>
                {reportData.comparison.map((row) => (
                  <tr key={row.method}>
                    <td>{row.method}</td>
                    <td>{row.focus}</td>
                    <td>{row.idea}</td>
                    <td>{row.strength}</td>
                    <td>{row.caution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="source-chip-list">
            {reportData.comparison.map((row) => (
              <li key={`${row.method}-source`} className="source-chip">
                <strong>{row.method}</strong> {row.source}
              </li>
            ))}
          </ul>
        </section>

        <section className="report-section" aria-labelledby="sections-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">핵심 설명</p>
            <h2 id="sections-title" className="section-heading__title">
              논문별 원리와 해석
            </h2>
          </div>
          <div className="section-grid">
            {reportData.sections.map((section) => (
              <SectionCard key={section.id} {...section} />
            ))}
          </div>
        </section>

        <section className="report-section" aria-labelledby="metrics-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">핵심 수치</p>
            <h2 id="metrics-title" className="section-heading__title">
              숫자로 보면 더 분명한 포인트
            </h2>
          </div>
          <div className="metric-grid">
            {reportData.metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <p className="metric-card__label">{metric.label}</p>
                <h3 className="metric-card__value">{metric.value}</h3>
                <p className="metric-card__description">{metric.description}</p>
                <p className="metric-card__source">{metric.source}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="report-section" aria-labelledby="takeaways-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">요약</p>
            <h2 id="takeaways-title" className="section-heading__title">
              읽고 나서 남겨야 할 문장
            </h2>
          </div>
          <ul className="takeaway-list">
            {reportData.takeaways.map((item) => (
              <li key={item} className="takeaway-list__item">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="report-section" aria-labelledby="caveats-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">주의점</p>
            <h2 id="caveats-title" className="section-heading__title">
              숫자를 읽을 때 조심해야 할 부분
            </h2>
          </div>
          <div className="caveat-grid">
            {reportData.caveats.map((item) => (
              <article key={item.title} className="caveat-card">
                <h3 className="caveat-card__title">{item.title}</h3>
                <p className="caveat-card__detail">{item.detail}</p>
                <p className="caveat-card__source">{item.source}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="report-section" aria-labelledby="references-title">
          <div className="section-heading">
            <p className="section-heading__eyebrow">원문</p>
            <h2 id="references-title" className="section-heading__title">
              참고자료와 발표 시점
            </h2>
          </div>
          <ul className="reference-list">
            {reportData.references.map((reference) => (
              <li key={reference.url} className="reference-list__item">
                <p className="reference-list__meta">
                  {reference.kind === "paper" ? "Paper" : "Blog"} · {reference.date}
                </p>
                <a
                  className="reference-list__title"
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {reference.title}
                </a>
                <p className="reference-list__note">{reference.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="report-footer">
          <p className="report-footer__date">
            작성 기준일: {reportData.updatedAt}
          </p>
          <p className="report-footer__note">
            본 페이지는 사용자 제공 PDF 3개와 2026년 3월 24일 Google Research
            공식 블로그 글만을 근거로 구성했다.
          </p>
        </footer>
      </article>
    </main>
  );
}
