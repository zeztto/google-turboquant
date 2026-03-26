import {
  reportData,
  type ComparisonRow,
  type MetricItem,
  type ReferenceItem,
  type ReportSection,
  type ReportStat,
  type SummaryPoint,
} from "@/content/report";

function StatItem({ label, value, note }: ReportStat) {
  return (
    <div className="report-stat">
      <dt className="report-stat__label">{label}</dt>
      <dd className="report-stat__value">{value}</dd>
      <p className="report-stat__note">{note}</p>
    </div>
  );
}

function SummaryItem({ title, body }: SummaryPoint) {
  return (
    <article className="summary-item">
      <h3 className="summary-item__title">{title}</h3>
      <p className="summary-item__body">{body}</p>
    </article>
  );
}

function SectionArticle(section: ReportSection) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="article-section"
    >
      <header className="article-section__header">
        <p className="article-section__kicker">{section.kicker}</p>
        <div className="article-section__title-row">
          <h2 id={`${section.id}-title`} className="article-section__title">
            {section.title}
          </h2>
          <span className="article-section__lens">{section.lens}</span>
        </div>
        <p className="article-section__summary">{section.summary}</p>
      </header>

      <div className="report-prose">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {section.bullets ? (
        <ul className="report-bullets">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="report-bullets__item">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}

      {section.callout ? (
        <aside className="report-callout">
          <h3 className="report-callout__title">{section.callout.title}</h3>
          <p className="report-callout__body">{section.callout.body}</p>
        </aside>
      ) : null}

      <p className="article-section__source">근거: {section.source}</p>
    </section>
  );
}

function ComparisonTable({ rows }: { rows: readonly ComparisonRow[] }) {
  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <caption className="sr-only">QJL, PolarQuant, TurboQuant 비교표</caption>
        <thead>
          <tr>
            <th scope="col">방법</th>
            <th scope="col">직접 겨냥한 대상</th>
            <th scope="col">아주 쉬운 설명</th>
            <th scope="col">메모리 절감 포인트</th>
            <th scope="col">비즈니스 의미</th>
            <th scope="col">주의점</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.method}>
              <td>{row.method}</td>
              <td>{row.target}</td>
              <td>{row.easyExplanation}</td>
              <td>{row.memoryBenefit}</td>
              <td>{row.businessMeaning}</td>
              <td>{row.caution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricList({ items }: { items: readonly MetricItem[] }) {
  return (
    <div className="metric-list">
      {items.map((item) => (
        <article key={item.label} className="metric-item">
          <p className="metric-item__label">{item.label}</p>
          <h3 className="metric-item__value">{item.value}</h3>
          <p className="metric-item__body">{item.body}</p>
          <p className="metric-item__source">{item.source}</p>
        </article>
      ))}
    </div>
  );
}

function ReferenceList({ items }: { items: readonly ReferenceItem[] }) {
  return (
    <ul className="reference-list">
      {items.map((item) => (
        <li key={item.url} className="reference-list__item">
          <p className="reference-list__meta">
            {item.kind === "paper" ? "Paper" : "Blog"} · {item.date}
          </p>
          <a
            className="reference-list__title"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            {item.title}
          </a>
          <p className="reference-list__note">{item.note}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <main className="report-page">
      <article className="report-article">
        <header className="report-masthead">
          <p className="report-masthead__eyebrow">Long-form Research Report</p>
          <h1 className="report-masthead__title">{reportData.title}</h1>
          <p className="report-masthead__subtitle">{reportData.subtitle}</p>
          <p className="report-masthead__note">{reportData.heroNote}</p>
          <dl className="report-stats">
            {reportData.stats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </dl>
        </header>

        <div className="report-layout">
          <aside className="report-sidebar">
            <nav className="report-toc" aria-labelledby="toc-title">
              <p id="toc-title" className="report-toc__title">
                목차
              </p>
              <ol className="report-toc__list">
                {reportData.sections.map((section) => (
                  <li key={section.id} className="report-toc__item">
                    <a href={`#${section.id}`} className="report-toc__link">
                      {section.kicker} {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <section className="sidebar-panel" aria-labelledby="basis-title">
              <p id="basis-title" className="sidebar-panel__title">
                작성 기준
              </p>
              <p className="sidebar-panel__body">{reportData.basis}</p>
            </section>
          </aside>

          <div className="report-main">
            <section className="report-intro" aria-labelledby="summary-title">
              <div className="section-head">
                <p className="section-head__eyebrow">먼저 읽기</p>
                <h2 id="summary-title" className="section-head__title">
                  이 보고서의 핵심 요약
                </h2>
              </div>
              <div className="summary-grid">
                {reportData.summaryPoints.map((point) => (
                  <SummaryItem key={point.title} {...point} />
                ))}
              </div>
            </section>

            {reportData.sections.map((section) => (
              <SectionArticle key={section.id} {...section} />
            ))}

            <section className="article-section" aria-labelledby="comparison-title">
              <header className="article-section__header">
                <p className="article-section__kicker">부록 A</p>
                <div className="article-section__title-row">
                  <h2 id="comparison-title" className="article-section__title">
                    세 기술을 한눈에 비교하면
                  </h2>
                  <span className="article-section__lens">사실+해석</span>
                </div>
                <p className="article-section__summary">
                  같은 비트 수를 단순 비교하기보다, 무엇을 저장하고 어떤 오버헤드를
                  줄이며 제품에 어떤 영향을 주는지로 읽는 편이 더 정확하다.
                </p>
              </header>
              <ComparisonTable rows={reportData.comparison} />
            </section>

            <section className="article-section" aria-labelledby="metrics-title">
              <header className="article-section__header">
                <p className="article-section__kicker">부록 B</p>
                <div className="article-section__title-row">
                  <h2 id="metrics-title" className="article-section__title">
                    보고서에서 꼭 기억할 숫자
                  </h2>
                  <span className="article-section__lens">사실 기반</span>
                </div>
                <p className="article-section__summary">
                  아래 수치는 논문과 공식 블로그에서 직접 확인한 값 또는 그 요약이다.
                </p>
              </header>
              <MetricList items={reportData.metrics} />
            </section>

            <section className="article-section" aria-labelledby="references-title">
              <header className="article-section__header">
                <p className="article-section__kicker">부록 C</p>
                <div className="article-section__title-row">
                  <h2 id="references-title" className="article-section__title">
                    참고자료
                  </h2>
                  <span className="article-section__lens">사실 기반</span>
                </div>
                <p className="article-section__summary">
                  보고서 작성에 직접 사용한 원문 목록이다.
                </p>
              </header>
              <ReferenceList items={reportData.references} />
            </section>
          </div>
        </div>

        <footer className="report-footer">
          <p className="report-footer__date">작성 기준일: {reportData.updatedAt}</p>
          <p className="report-footer__note">{reportData.basis}</p>
        </footer>
      </article>
    </main>
  );
}
