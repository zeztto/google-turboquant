export type ReportStat = {
  label: string;
  value: string;
  note: string;
};

export type SummaryPoint = {
  title: string;
  body: string;
};

export type ReportSection = {
  id: string;
  kicker: string;
  title: string;
  lens: "사실 기반" | "사실+해석" | "시장 해석";
  summary: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: {
    title: string;
    body: string;
  };
  source: string;
};

export type ComparisonRow = {
  method: string;
  target: string;
  easyExplanation: string;
  memoryBenefit: string;
  businessMeaning: string;
  caution: string;
};

export type MetricItem = {
  label: string;
  value: string;
  body: string;
  source: string;
};

export type ReferenceItem = {
  title: string;
  kind: "paper" | "blog";
  date: string;
  url: string;
  note: string;
};

export const reportData = {
  title: "TurboQuant 계열 기술 보고서",
  subtitle:
    "LLM의 KV 캐시가 무엇인지부터 시작해 QJL, PolarQuant, TurboQuant가 메모리를 어떻게 줄이고 어떤 시장적 의미를 가질 수 있는지까지 길게 설명한 한국어 보고서",
  updatedAt: "2026-03-26",
  basis:
    "이 보고서는 사용자 제공 PDF 3편과 2026년 3월 24일자 Google Research 공식 블로그만을 근거로 작성했다. 시장 영향 파트는 이 자료들에 근거한 해석이며, 별도의 시장 통계나 기업 실적 자료는 사용하지 않았다.",
  heroNote:
    "핵심은 단순하다. LLM이 긴 문장을 읽을수록 기억해 두어야 할 중간 정보가 늘어나는데, 이 기억 공간이 바로 KV 캐시다. QJL, PolarQuant, TurboQuant는 이 기억 공간을 더 작은 비용으로 저장하려는 서로 연결된 시도다.",
  stats: [
    {
      label: "근거 자료",
      value: "논문 3편 + 공식 블로그 1건",
      note: "QJL 2024-07-19, PolarQuant 2025-02-04, TurboQuant 2025-04-28, Google Research 블로그 2026-03-24",
    },
    {
      label: "핵심 질문",
      value: "KV 캐시를 더 싸게 저장할 수 있는가",
      note: "긴 문맥 LLM 서비스의 메모리 병목을 줄이는 것이 핵심이다.",
    },
    {
      label: "독자 수준",
      value: "비전공자에 가까운 학부생",
      note: "수식보다 개념, 비유, 제품·시장 관점의 연결을 우선했다.",
    },
    {
      label: "중요한 관점",
      value: "비트 수가 아니라 총비용",
      note: "scale, zero point, codebook, 복원 비용 같은 숨은 오버헤드를 함께 봐야 한다.",
    },
  ] as ReportStat[],
  summaryPoints: [
    {
      title: "LLM의 기억 공간이 문제의 출발점이다",
      body:
        "LLM은 다음 토큰을 만들 때 이전 토큰의 정보를 완전히 잊지 않는다. 이미 계산한 key와 value를 저장해 두고 다시 참조하는데, 문맥이 길어질수록 이 저장 공간이 커진다.",
    },
    {
      title: "기존 양자화는 생각보다 완전하지 않았다",
      body:
        "숫자를 적은 비트로 바꾸는 것만으로는 충분하지 않았다. 실제 시스템에서는 블록마다 scale과 zero point를 같이 저장해야 해, 압축률이 기대만큼 나오지 않는 경우가 많았다.",
    },
    {
      title: "세 기술은 서로 다른 방향에서 같은 병목을 찌른다",
      body:
        "QJL은 sign만 남기는 매우 공격적인 압축을 보여주고, PolarQuant는 angle 중심 표현으로 정규화 부담을 줄이며, TurboQuant는 이를 더 일반적인 벡터 양자화 틀로 확장한다.",
    },
    {
      title: "시장 관점의 의미는 메모리 절감 그 자체보다 크다",
      body:
        "메모리가 덜 들면 같은 GPU에서 더 많은 요청을 처리하거나, 더 긴 문맥을 제공하거나, 더 저렴한 하드웨어에서 비슷한 기능을 낼 수 있다. 결국 제품 가격, 지연시간, 동시 처리량에 모두 영향을 준다.",
    },
  ] as SummaryPoint[],
  sections: [
    {
      id: "intro",
      kicker: "1. 문제의식",
      title: "왜 지금 KV 캐시 이야기를 해야 하는가",
      lens: "사실 기반",
      summary:
        "LLM 경쟁은 이제 단순히 모델 파라미터 수만으로 설명되지 않는다. 같은 모델이라도 얼마나 긴 문맥을 빠르고 저렴하게 처리하느냐가 제품 경쟁력에 직접 연결된다.",
      paragraphs: [
        "많은 사람은 LLM의 성능을 이야기할 때 모델 크기, 벤치마크 점수, 혹은 최신 모델 이름에 먼저 주목한다. 하지만 실제 서비스를 운영하는 입장에서는 다른 질문이 훨씬 더 절박하다. 사용자가 긴 문서를 넣었을 때 이 모델이 버벅이지 않고 반응할 수 있는가, 같은 GPU 자원으로 몇 명을 동시에 처리할 수 있는가, 그리고 그 비용이 감당 가능한 수준인가가 더 중요하다. 여기서 자주 병목이 되는 것이 바로 KV 캐시다.",
        "논문 3편과 Google Research 블로그는 모두 이 지점을 건드린다. QJL은 2024년 7월 19일에 공개되었고, PolarQuant는 2025년 2월 4일, TurboQuant는 2025년 4월 28일 공개되었다. 그 뒤 Google Research는 2026년 3월 24일 블로그에서 이 흐름을 하나의 계열 연구처럼 묶어 소개했다. 순서상으로 보면, 먼저 zero-overhead 성격의 key 압축 아이디어가 나오고, 그 다음 angle 기반 KV 압축이 등장하며, 이후 더 일반적인 온라인 벡터 양자화 틀로 확장된 셈이다.",
        "이 보고서의 목표는 논문의 수학을 재현하는 것이 아니다. 오히려 'LLM에서 KV가 도대체 무엇인지', '왜 그것이 메모리를 잡아먹는지', '이 세 기술이 그 문제를 얼마나 다르게 풀고 있는지', 그리고 '이 변화가 제품과 시장에 어떤 파급효과를 줄 수 있는지'를 긴 글 형태로 차근차근 설명하는 데 있다. 따라서 아래에서는 가장 기초적인 LLM 동작 방식부터 다시 시작한다.",
      ],
      callout: {
        title: "이 보고서의 읽는 법",
        body:
          "앞부분은 개념 설명, 중간은 기술 설명, 뒷부분은 비용과 시장 해석으로 이어진다. 기술 파트를 먼저 훑고 싶다면 6절 QJL부터 읽어도 되지만, KV 캐시 자체가 익숙하지 않다면 2절과 3절부터 읽는 편이 이해에 훨씬 유리하다.",
      },
      source: "QJL p.1-3, PolarQuant p.1-3, TurboQuant p.1-2, Google Research 블로그 2026-03-24",
    },
    {
      id: "llm-basics",
      kicker: "2. 기초 개념",
      title: "LLM은 문장을 어떻게 읽고 다음 단어를 예측하는가",
      lens: "사실 기반",
      summary:
        "KV 캐시를 이해하려면 먼저 LLM이 문장을 한 번에 다 이해하는 기계가 아니라, 토큰 단위로 다음 출력을 계속 예측하는 시스템이라는 점부터 알아야 한다.",
      paragraphs: [
        "LLM은 텍스트를 사람이 보는 단어 그대로 다루지 않는다. 먼저 문장을 잘게 쪼개 토큰 단위로 바꾸고, 각 토큰을 숫자 벡터로 바꾼 뒤, 이 벡터들의 관계를 계산해 다음 토큰이 무엇일지 예측한다. 여기서 중요한 점은 LLM이 답을 한 번에 완성하는 것이 아니라, 한 토큰을 만들고, 그 결과를 다시 입력의 일부로 삼아 그 다음 토큰을 만들고, 이런 과정을 반복한다는 것이다.",
        "이 반복 과정이 가능한 이유는 attention 메커니즘 때문이다. 현재 만들고 있는 토큰은 앞서 등장한 토큰들 가운데 무엇을 얼마나 참고해야 하는지를 attention으로 계산한다. 예를 들어 긴 계약서 요약을 할 때, 모델은 문서 앞부분의 정의 조항을 뒤에서 다시 참고해야 할 수도 있고, 긴 코드 파일을 읽다가 초반 함수 정의를 뒤에서 다시 참조해야 할 수도 있다. 즉, 긴 문맥을 다룰수록 과거 정보를 효율적으로 다시 꺼내 보는 능력이 중요해진다.",
        "문제는 이 계산을 매번 처음부터 다 다시 하면 너무 느리다는 것이다. 이미 읽은 토큰들에 대한 중간 결과를 저장해 두었다가 재사용해야 실용적인 속도가 나온다. KV 캐시는 바로 이 저장된 중간 결과다. 따라서 KV 캐시를 이해한다는 것은 곧 LLM이 '기억을 어떻게 저장하고 재사용하는가'를 이해하는 일과 거의 같다.",
      ],
      bullets: [
        "LLM은 토큰 단위로 다음 출력을 순차적으로 생성한다.",
        "attention은 현재 토큰이 과거 토큰 중 무엇을 참고해야 하는지 계산한다.",
        "실용적 속도를 위해 이미 계산한 중간 결과를 다시 써야 하고, 그 저장소가 KV 캐시다.",
      ],
      source: "QJL p.1-3, TurboQuant p.1-2",
    },
    {
      id: "kv-basics",
      kicker: "3. 기초 개념",
      title: "KV 캐시는 무엇이며 왜 '기억 창고'라고 볼 수 있는가",
      lens: "사실 기반",
      summary:
        "KV 캐시는 이미 읽은 토큰들에 대한 key와 value 벡터를 저장해 두는 공간이다. 쉽게 말해, 모델이 다음 토큰을 만들 때 과거를 다시 계산하지 않도록 돕는 고속 메모다.",
      paragraphs: [
        "Transformer 계열 모델에서 attention은 query, key, value라는 세 종류의 벡터를 사용한다. 현재 토큰 쪽에서 만들어지는 것이 query이고, 과거 토큰들 쪽에 저장되는 것이 key와 value라고 이해하면 된다. query는 '지금 무엇이 필요한가'를 묻는 쪽이고, key는 '어떤 정보가 어디에 있는가'를 나타내는 꼬리표, value는 '실제로 가져와야 할 내용'에 가깝다. 그래서 현재 query는 과거 key들을 훑어보며 관련성이 큰 것을 찾고, 그 결과를 바탕으로 value를 섞어 다음 표현을 만든다.",
        "이때 과거 토큰의 key와 value를 매번 다시 계산하면 비용이 너무 크다. 예를 들어 10,000번째 토큰을 생성할 때 1번째부터 9,999번째까지의 key와 value를 다시 다 계산한다면, 긴 문맥 생성은 사실상 비현실적이 된다. 그래서 이전 토큰들의 key와 value를 저장해 두고, 새 토큰이 들어올 때는 그 토큰의 query만 새로 계산한 뒤 기존 저장값과 바로 비교하는 방식이 널리 쓰인다. 이 저장된 묶음이 KV 캐시다.",
        "비유하자면, KV 캐시는 모델이 읽은 책의 모든 페이지에 붙여 둔 고속 인덱스 카드와 비슷하다. 책 전체를 매번 처음부터 읽는 대신, 이미 만들어 놓은 인덱스 카드를 빠르게 조회해 필요한 문장을 다시 꺼내 본다고 생각하면 된다. 긴 문맥에서 LLM의 품질과 속도를 동시에 지탱하는 핵심 요소가 바로 이 인덱스 카드 더미인 셈이다.",
      ],
      callout: {
        title: "아주 쉬운 비유",
        body:
          "query는 '지금 필요한 질문', key는 '정보가 붙어 있는 주소표', value는 '그 주소에서 실제로 가져오는 내용'이다. KV 캐시는 이전 주소표와 내용을 모아 둔 서랍이다.",
      },
      source: "QJL p.2-3, PolarQuant p.1-2, TurboQuant p.1-2",
    },
    {
      id: "memory-bottleneck",
      kicker: "4. 병목의 본질",
      title: "문맥이 길어질수록 KV 캐시는 왜 메모리를 급격히 잡아먹는가",
      lens: "사실 기반",
      summary:
        "KV 캐시의 크기는 토큰 수가 늘수록 거의 비례해서 커진다. 게다가 레이어 수와 헤드 수도 함께 곱해지므로, 긴 문맥과 큰 모델이 만나면 메모리 비용이 빠르게 폭증한다.",
      paragraphs: [
        "KV 캐시는 한두 개의 숫자를 저장하는 공간이 아니다. 각 토큰마다, 각 레이어마다, 각 attention head마다 key와 value 벡터가 쌓인다. 즉 문맥 길이가 2배가 되면 단순히 저장 문장 수만 2배가 되는 것이 아니라, 모델 내부 여러 층에서 보관해야 할 중간 벡터가 줄줄이 늘어난다. 논문들이 KV 캐시를 반복해서 '주요 메모리 병목'이라고 부르는 이유가 여기에 있다.",
        "이 문제는 특히 긴 문맥 모델에서 더 아프게 드러난다. 짧은 대화형 챗봇에서는 몇 천 토큰 수준이 감당 가능할 수 있지만, 긴 논문, 계약서, 코드 저장소, 고객지원 로그, 장시간 회의록처럼 수만 토큰 이상을 다루기 시작하면 KV 캐시가 GPU 메모리의 큰 부분을 차지하게 된다. 이는 단순히 메모리 점유율이 높다는 말로 끝나지 않는다. 캐시가 커질수록 GPU가 이를 읽고 쓰는 비용도 커지며, 실제 지연시간과 동시 처리량에도 영향을 준다.",
        "서비스 운영 관점에서 더 심각한 문제는 세션이 늘수록 캐시가 사용자별로 따로 필요하다는 점이다. 한 명이 긴 대화를 하는 것과 열 명이 동시에 긴 대화를 하는 것은 비용 구조가 완전히 다르다. 논문들이 KV 캐시를 줄이는 일을 단순한 알고리즘 최적화가 아니라 실제 배포 문제로 다루는 이유는, 이 저장 비용이 결국 사용자 수용량과 서버 운영비에 직결되기 때문이다.",
      ],
      bullets: [
        "문맥 길이가 길어질수록 KV 캐시는 거의 선형적으로 커진다.",
        "레이어와 헤드가 많을수록 같은 문맥에서도 캐시 부담이 더 커진다.",
        "메모리 점유율뿐 아니라 HBM과 온칩 메모리 사이 이동 비용도 병목이 된다.",
        "사용자 세션이 많아질수록 KV 캐시는 곧 서비스 수용량 문제로 이어진다.",
      ],
      source: "QJL p.1-3, PolarQuant p.1-2, TurboQuant p.1-2",
    },
    {
      id: "hidden-overhead",
      kicker: "5. 병목의 본질",
      title: "왜 기존 양자화는 '숨은 오버헤드' 때문에 기대만큼 시원하지 않았는가",
      lens: "사실 기반",
      summary:
        "양자화는 원래 숫자를 적은 비트로 저장하는 기술이지만, 실제 시스템에서는 숫자만 줄인다고 끝나지 않는다. 복원에 필요한 추가 정보가 붙으면 압축 효과가 줄어든다.",
      paragraphs: [
        "양자화라는 말만 들으면 많은 사람은 16비트나 32비트 숫자를 4비트나 3비트로 줄이는 장면을 먼저 떠올린다. 틀린 이해는 아니지만, 실제 구현에서는 대개 그렇게 단순하지 않다. 벡터를 일정 블록으로 나누고, 각 블록마다 값의 범위를 맞추기 위해 scale과 zero point 같은 보정 상수를 따로 저장해야 하는 경우가 많다. 결국 데이터 본체는 작아졌는데, 옆에 붙는 설명서가 생각보다 커지는 것이다.",
        "논문들이 반복해서 강조하는 'memory overhead'가 바로 이 추가 설명서 비용이다. 예를 들어 숫자를 3비트로 줄였다고 말해도, 각 블록에 대한 보정 상수를 16비트나 32비트로 함께 들고 다니면 실제 체감 압축률은 낮아진다. 이 차이는 연구 슬라이드에서는 작게 보일 수 있지만, 대규모 서비스에서는 매우 크게 누적될 수 있다. 수백만 개 벡터, 수천 개 세션, 긴 문맥이 겹치면 보정 상수의 저장량도 결코 무시할 수 없기 때문이다.",
        "QJL, PolarQuant, TurboQuant의 공통 문제의식은 결국 여기로 모인다. '숫자 본체를 더 세게 압축하자'만으로는 부족하고, '압축을 위해 추가로 붙는 메타데이터와 계산 오버헤드까지 줄이자'가 진짜 목표라는 것이다. 이 관점 차이 때문에 이들 논문은 단순한 저비트화보다 더 흥미롭다. 제품 입장에서는 명목 비트 수보다 총소유비용에 가깝기 때문이다.",
      ],
      callout: {
        title: "핵심 문장",
        body:
          "비트 수가 낮다는 말과 실제 메모리 사용량이 낮다는 말은 같지 않다. QJL, PolarQuant, TurboQuant는 그 차이를 좁히려는 연구들이다.",
      },
      source: "QJL p.1-3, PolarQuant p.1-3, Google Research 블로그 lines 217-234",
    },
    {
      id: "qjl",
      kicker: "6. 기술 설명",
      title: "QJL을 아주 쉽게 설명하면: 값을 다 저장하지 말고 방향의 부호만 남기자",
      lens: "사실 기반",
      summary:
        "QJL은 key 벡터를 JL 랜덤 투영한 뒤 sign만 저장한다. 말하자면 숫자의 세밀한 크기보다 방향성의 요약본만 남기는 방식이다.",
      paragraphs: [
        "QJL의 출발점은 꽤 과감하다. key 벡터를 그대로 저장하지 말고, 먼저 랜덤 투영으로 다른 공간에 보낸 다음, 그 결과의 각 좌표에서 부호만 남기자는 것이다. 즉 '+'인지 '-'인지만 저장하고 구체적인 실수값은 버린다. 처음 들으면 너무 많은 정보를 버리는 것처럼 느껴진다. 그러나 논문은 query는 같은 투영을 거치되 양자화하지 않고 유지하면, 원래의 inner product를 편향 없이 추정할 수 있다고 설명한다. 여기서 inner product는 attention 계산의 핵심이다.",
        "이 아이디어를 쉬운 비유로 바꾸면 이렇다. 아주 정밀한 지도를 전부 저장하는 대신, 특정 방향으로 꺾이는지 아닌지만 남긴 초간단 길찾기 표식을 만든다고 생각하면 된다. 정보는 많이 사라졌지만, 지금 가려는 방향과 얼마나 잘 맞는지는 의외로 꽤 잘 판단할 수 있다는 것이다. QJL이 중요한 이유는, 이 과정에서 기존 양자화가 자주 요구하던 block별 scale과 zero point를 거의 들고 다니지 않아도 된다는 점이다. 그래서 논문 제목 자체가 zero overhead를 내세운다.",
        "논문 초록은 QJL이 KV 캐시를 3비트 수준으로 압축하면서 5배가 넘는 메모리 감소를 보였고, 정확도 손실 없이 더 빠른 실행 시간을 얻었다고 요약한다. 장기 문맥 평가에서는 LongBench 계열에서 경쟁 기법과 비슷하거나 더 나은 점수를 보고했다. 물론 이는 '모든 상황에서 언제나 완전 무손실'이라는 뜻은 아니다. 하지만 적어도 key를 아주 공격적으로 압축하면서도 attention 핵심 계산을 유지하려는 방향이 실제로 가능하다는 것을 강하게 보여 준 사례라고 볼 수 있다.",
      ],
      bullets: [
        "출발점: key를 JL 랜덤 투영 뒤 sign-bit로 저장한다.",
        "핵심 장점: block별 scale, zero point를 줄여 zero-overhead 성격을 노린다.",
        "핵심 이론: query는 양자화하지 않은 투영을 사용해 inner product를 unbiased하게 추정한다.",
        "초록 요약: 3비트 수준, 5배 이상 메모리 절감, 빠른 런타임.",
      ],
      callout: {
        title: "QJL의 한 줄 요약",
        body:
          "정확한 숫자를 저장하는 대신, '이 벡터가 어느 쪽을 가리키는가'에 대한 아주 거친 스케치를 남기되, query 쪽에서 그 거칠음을 보완해 attention을 유지하는 방식이다.",
      },
      source: "QJL p.1-7, p.10-11",
    },
    {
      id: "polarquant",
      kicker: "7. 기술 설명",
      title: "PolarQuant를 아주 쉽게 설명하면: 좌표보다 각도를 저장하자",
      lens: "사실 기반",
      summary:
        "PolarQuant는 벡터를 회전시킨 뒤 극좌표로 바꾸고 angle을 양자화한다. 왜 이런 우회로를 택하느냐 하면, 그렇게 해야 분포가 더 예쁘고 예측 가능해져 정규화 오버헤드를 줄이기 쉬워지기 때문이다.",
      paragraphs: [
        "PolarQuant는 QJL과 다르게 sign만 남기는 식으로 단순화하지 않는다. 대신 표현 방식을 바꾼다. 보통 벡터는 x축, y축, z축처럼 직교좌표로 생각하지만, PolarQuant는 벡터를 먼저 랜덤하게 회전시킨 뒤 극좌표 형태로 본다. 그러면 벡터는 여러 개의 angle과 최종 radius로 다시 표현된다. 이때 논문은 회전 후 angle 분포가 분석 가능한 좋은 형태로 모이기 때문에, 그 angle들을 더 효율적으로 양자화할 수 있다고 본다.",
        "비유하면 '동쪽으로 3칸, 북쪽으로 4칸'이라고 적는 대신 '총 5칸을 37도 방향으로 이동'이라고 적는 셈이다. 어떤 문제에서는 뒤의 표현이 더 간결하고 규칙적이다. PolarQuant의 주장은 KV 벡터도 비슷하다는 것이다. 값을 각 축 방향으로 따로 줄이기보다, 회전 후 angle 구조를 잡아서 저장하면 정규화 부담을 줄이고도 품질을 잘 유지할 수 있다. 논문은 이를 위해 recursive polar transformation과 angle 분포 분석을 함께 제시한다.",
        "실험 결과도 이 방향이 단순한 아이디어 실험에 그치지 않음을 보여 준다. 초록은 KV 캐시를 4.2배 이상 압축하면서 state-of-the-art 대비 가장 좋은 품질을 얻었다고 요약한다. 13쪽 Table 1에서는 LongBench 평균이 Full Cache 48.63에 대해 PolarQuant 48.11, PolarQuant-R offline 48.29, PolarQuant-R online 48.37로 나타난다. 다만 14쪽 Table 2를 보면 prefill 시간이 Exact보다 크게 늘어날 수 있다는 점도 함께 드러난다. 즉 품질은 매우 좋지만, 계산 경로가 더 복잡하다는 대가가 있다.",
      ],
      bullets: [
        "출발점: random preconditioning으로 분포를 다듬은 뒤 극좌표 angle을 양자화한다.",
        "핵심 장점: 각도 분포가 잘 모이면 block별 정규화 오버헤드를 줄일 수 있다.",
        "대표 수치: 초록 기준 4.2배 이상 압축, LongBench 평균은 Full Cache에 매우 근접.",
        "주의점: 품질은 좋지만 prefill 시간은 늘어날 수 있다.",
      ],
      callout: {
        title: "PolarQuant의 한 줄 요약",
        body:
          "벡터를 회전시켜 각도로 다시 표현하면 더 압축하기 좋은 모양이 되고, 그 덕분에 숨은 메타데이터 비용을 줄이면서도 품질을 지키기 쉽다는 아이디어다.",
      },
      source: "PolarQuant p.1-3, p.11-14",
    },
    {
      id: "turboquant",
      kicker: "8. 기술 설명",
      title: "TurboQuant를 아주 쉽게 설명하면: 큰 그림은 효율적으로, 남은 오차는 작게 보정하자",
      lens: "사실 기반",
      summary:
        "TurboQuant는 QJL과 PolarQuant의 감각을 더 일반적인 벡터 양자화 틀로 넓힌 연구다. 먼저 MSE에 강한 압축을 하고, 그 뒤 남은 residual에 1비트 QJL을 붙여 inner product 편향을 보정한다.",
      paragraphs: [
        "TurboQuant 논문은 문제를 더 넓게 본다. 단지 KV 캐시 압축만이 아니라, 고차원 벡터를 온라인 상황에서 어떻게 거의 최적에 가깝게 압축할 것인가를 묻는다. 이 논문에서 먼저 하는 일은 입력 벡터를 랜덤 회전한 뒤 좌표별로 MSE에 강한 양자화를 적용하는 것이다. 여기까지는 '벡터를 최대한 잘 줄이는 일'에 가깝다. 그런데 논문은 여기서 멈추지 않는다. MSE가 좋다고 해서 inner product가 꼭 편향 없이 보존되는 것은 아니기 때문이다.",
        "그래서 TurboQuant는 2단계 구조를 취한다. 1단계에서 벡터의 큰 윤곽을 잘 저장하고, 2단계에서 남은 residual에 1비트 QJL을 적용해 inner product 측면의 bias를 잡는다. 쉽게 말하면, 먼저 그림을 크게 잘 그린 뒤, 나중에 중요한 디테일만 아주 싼 비용으로 보정하는 것이다. 이 구조 때문에 TurboQuant는 QJL의 강점과 더 일반적인 양자화 이론을 한 틀에 묶는 연구처럼 읽힌다.",
        "수치도 인상적이다. 논문 초록은 정보이론적 lower bound에 약 2.7배의 작은 상수 요인으로 접근한다고 주장하고, KV 캐시 실험에서는 3.5 bits per channel에서 품질 중립, 2.5 bits per channel에서 약간의 품질 저하를 보고한다. 19쪽 Figure 4에서는 Needle-In-A-Haystack 점수가 Full-Precision 0.997, PolarQuant 0.995, TurboQuant 0.997로 제시된다. Google Research 블로그는 이를 대중적으로 더 강하게 요약해 3비트 수준 압축, 최소 6배 메모리 절감, H100에서 4비트 기준 최대 8배 속도 향상을 소개한다. 다만 블로그의 숫자는 홍보용 요약이며, 실제 논문 표는 2.5비트와 3.5비트의 effective bit 구성을 더 세밀하게 사용한다는 점을 구분해야 한다.",
      ],
      bullets: [
        "1단계: 랜덤 회전 뒤 MSE에 강한 양자화로 큰 윤곽을 저장한다.",
        "2단계: residual에 1비트 QJL을 적용해 inner product bias를 보정한다.",
        "초록 수치: 3.5 bits 품질 중립, 2.5 bits 미세한 품질 저하, lower bound와의 차이는 약 2.7배 상수 요인.",
        "Figure 4: Needle-In-A-Haystack에서 Full-Precision 0.997, TurboQuant 0.997.",
      ],
      callout: {
        title: "TurboQuant의 한 줄 요약",
        body:
          "벡터의 대부분은 효율적으로 압축하고, 정말 중요한 오차만 저렴하게 보정해 전체 품질을 끌어올리는 2단계 양자화 전략이다.",
      },
      source: "TurboQuant p.1-2, p.18-21, Google Research 블로그 lines 222-257",
    },
    {
      id: "relationship",
      kicker: "9. 기술의 연결",
      title: "QJL, PolarQuant, TurboQuant는 각각 따로 놀지 않는다",
      lens: "사실+해석",
      summary:
        "세 기술은 서로 완전히 다른 세계의 논문이 아니다. 오버헤드를 줄이고, inner product를 지키고, 긴 문맥 압축을 실용화하려는 하나의 흐름 안에서 보면 더 잘 보인다.",
      paragraphs: [
        "QJL은 가장 선명한 문제를 겨냥한다. 'key를 더 적은 비용으로 저장하면서 attention의 핵심 계산을 유지할 수 있는가'에 대한 대답이다. PolarQuant는 여기서 한 걸음 다르게 나아가, 표현 방식을 바꾸면 정규화 오버헤드를 더 줄일 수 있지 않을까를 묻는다. TurboQuant는 다시 시야를 넓혀, 아예 온라인 벡터 양자화 전반에서 near-optimal distortion을 노릴 수 있는가를 묻는다. 순서대로 보면 점점 더 일반적인 틀로 올라가는 구조다.",
        "Google Research 블로그도 이 연결을 의도적으로 강조한다. 블로그는 TurboQuant를 최신 기술로 소개하면서도, 그것이 성립하는 배경으로 QJL과 PolarQuant를 함께 꺼낸다. 다만 엄밀하게 보면 블로그는 대중 설명을 위해 1단계를 PolarQuant식 직관으로 단순화해 소개하는 반면, 논문은 random rotation과 coordinate-wise scalar quantizer를 통한 더 일반적인 정보이론 관점으로 서술한다. 따라서 'TurboQuant = PolarQuant + QJL'이라고 완전히 등호로 적는 것은 약간 거칠다. 하지만 'QJL과 PolarQuant가 보여 준 통찰이 TurboQuant의 이야기 속에서 다시 만난다'고 이해하는 것은 꽤 설득력 있다.",
        "이 연결을 이해하면 연구의 의의도 커진다. 개별 논문 하나가 특정 벤치마크에서 잘 나온 것보다 더 중요한 것은, 메모리 오버헤드, inner product 보존, hardware-friendly 구현이라는 세 축이 점점 하나의 설계 철학으로 합쳐지고 있다는 점이다. 서비스 환경에서 실제로 필요한 것도 바로 이런 통합적 접근이다.",
      ],
      source: "TurboQuant p.1-2, Google Research 블로그 lines 218-239, 세 논문 공통 비교",
    },
    {
      id: "economics",
      kicker: "10. 제품과 비용",
      title: "메모리를 줄인다는 것은 곧 서비스 비용 구조를 바꾼다는 뜻이다",
      lens: "사실+해석",
      summary:
        "논문은 메모리와 속도를 이야기하지만, 제품 관점에서는 이는 결국 비용, 지연시간, 동시 처리량, 그리고 제공 가능한 기능 범위를 바꾼다.",
      paragraphs: [
        "LLM 서비스를 운영할 때 비용은 단순히 연산량만으로 결정되지 않는다. 실제로는 메모리 용량과 메모리 이동이 성능과 비용을 크게 좌우한다. KV 캐시가 작아지면 가장 먼저 기대할 수 있는 변화는 같은 GPU에서 동시에 더 많은 세션을 유지할 수 있다는 점이다. 예를 들어 이전에는 긴 문맥 요청 몇 개만 받아도 메모리가 꽉 차던 구성이, 압축 이후에는 더 많은 동시 요청을 수용할 가능성이 생긴다. 이 변화는 곧 토큰당 운영비, 혹은 사용자당 서비스 비용에 직접 연결된다.",
        "두 번째 변화는 지연시간이다. 메모리가 덜 들면 단순히 '더 많이 저장할 수 있다'에서 끝나지 않는다. 데이터를 덜 읽고 덜 옮기게 되면서 실제 생성 속도가 빨라질 수 있다. Google Research 블로그가 H100에서 4비트 TurboQuant가 32비트 key 대비 최대 8배 속도 향상을 보였다고 소개한 이유도 이 맥락에 있다. 물론 이 수치는 블로그 요약이므로 일반화는 조심해야 하지만, 적어도 메모리 절감이 곧 속도 개선으로 이어질 수 있다는 방향성은 분명하다.",
        "세 번째 변화는 제품 기능 범위다. 메모리가 비싸면 기업은 컨텍스트 길이를 짧게 제한하거나, 긴 문서 처리 기능을 상위 요금제로 묶거나, 특정 작업을 비동기 처리로 돌릴 수밖에 없다. 반대로 KV 캐시 압축이 실용 수준으로 좋아지면 더 긴 파일 업로드, 더 긴 대화 기록 유지, 더 긴 코드 저장소 분석, 더 긴 멀티턴 에이전트 작업을 같은 비용대에서 제공할 가능성이 커진다. 따라서 이 연구의 가치는 단순한 알고리즘 점수보다 '어떤 제품이 같은 가격에서 가능해지는가'라는 질문으로 보는 편이 더 낫다.",
      ],
      bullets: [
        "메모리 절감은 동일 GPU에서의 동시 세션 수 확대 가능성으로 이어진다.",
        "메모리 이동 감소는 실제 지연시간 개선으로 이어질 수 있다.",
        "더 긴 문맥 기능을 기본 플랜에 넣을 수 있는 여지가 생긴다.",
        "결국 압축 기술은 모델 성능 경쟁뿐 아니라 가격 경쟁에도 영향을 준다.",
      ],
      source: "QJL p.1-3, TurboQuant p.1-2, p.19-20, Google Research 블로그 lines 240-262",
    },
    {
      id: "market",
      kicker: "11. 시장 관점",
      title: "어떤 시장에서 이 변화가 특히 크게 느껴질까",
      lens: "시장 해석",
      summary:
        "이 절은 논문과 블로그에서 직접 숫자로 보장한 내용이 아니라, 그 기술적 방향을 바탕으로 한 합리적 해석이다. 요점은 긴 문맥과 높은 동시성이 중요한 시장일수록 효과가 크다는 것이다.",
      paragraphs: [
        "가장 직접적인 수혜 시장은 장문 문서 처리형 AI다. 법률 계약서 검토, 금융 문서 요약, 의료 기록 보조, 기업 검색, 고객지원 로그 분석처럼 입력이 긴 산업에서는 모델 성능만큼이나 '긴 문맥을 감당하는 비용'이 중요하다. KV 캐시 압축이 좋아지면 같은 하드웨어로 더 긴 문서를 다루거나, 같은 길이 문서를 더 싸게 처리할 수 있다. 이것은 단순 기술 개선이 아니라, 어떤 고객군에게 장문 분석 기능을 기본 제공할 수 있느냐의 문제로 이어진다.",
        "두 번째는 코딩 도우미와 에이전트 시장이다. 코드 어시스턴트는 종종 한두 파일이 아니라 저장소 단위의 긴 문맥을 봐야 한다. 또한 에이전트형 작업은 긴 대화 기록과 중간 계획, 도구 실행 결과를 계속 쌓는다. 이런 환경에서는 KV 캐시 비용이 특히 빠르게 커진다. 따라서 QJL, PolarQuant, TurboQuant 같은 기술은 단순 챗봇보다 오히려 장시간 세션을 유지하는 코딩·에이전트 제품에서 더 전략적일 수 있다.",
        "세 번째는 벡터 검색과 검색 증강 생성 시장이다. TurboQuant 논문은 KV 캐시뿐 아니라 nearest neighbor search에서도 PQ와 RabitQ보다 좋은 recall과 사실상 0에 가까운 양자화 시간을 보고한다. 이것은 단순히 LLM inference 최적화가 아니라, 검색 인덱스를 더 빠르게 만들고 더 작게 보관할 수 있다는 뜻으로 읽힌다. 따라서 이 계열 기술은 장기적으로 '모델 추론'과 '벡터 검색 인프라'가 서로 다른 팀의 문제가 아니라 같은 메모리 효율 문제의 두 얼굴이라는 인식을 강화할 가능성이 있다.",
        "경쟁 구도 측면에서는 초대형 클라우드 사업자뿐 아니라 오히려 중간 규모 AI 제품 회사에도 의미가 크다. 자본력이 매우 큰 회사는 비싼 GPU를 더 사서 문제를 버틸 수 있지만, 중간 규모 회사는 같은 성능을 더 싸게 내는 기술이 더 절실하다. 따라서 KV 캐시 압축이 실용화될수록, 단순히 최고 성능 모델을 가진 회사만이 아니라 '비슷한 경험을 더 낮은 단가로 제공하는 회사'가 경쟁력을 얻을 여지가 커질 수 있다.",
      ],
      callout: {
        title: "시장 해석 한 줄",
        body:
          "이 기술들의 진짜 파급효과는 '더 좋은 모델' 하나를 만드는 데만 있지 않고, '비슷한 품질을 더 낮은 단가로 서비스하는 방법'을 넓혀 준다는 데 있다.",
      },
      source: "TurboQuant p.19-21, Google Research 블로그 lines 252-262를 바탕으로 한 해석",
    },
    {
      id: "limits",
      kicker: "12. 주의점",
      title: "과장하지 않기 위해 꼭 붙여야 할 한계와 해석 주의사항",
      lens: "사실+해석",
      summary:
        "세 논문은 매우 인상적이지만, 그대로 '이제 메모리 문제는 끝났다'고 말할 단계는 아니다. 읽을 때 주의할 점이 몇 가지 분명히 있다.",
      paragraphs: [
        "첫째, 숫자 비교는 생각보다 조심해야 한다. QJL은 key 중심 설계가 강하고, PolarQuant는 KV 벡터의 angle 구조를 본다. TurboQuant는 effective bit를 outlier 채널 분리 방식과 함께 제시한다. 따라서 어떤 논문이 3비트라고 쓰고 다른 논문이 3.5비트라고 썼다고 해서, 이를 그대로 세로줄 맞춰 순위표처럼 비교하는 것은 위험하다. 압축 대상, 복원 방식, 비교 기준이 다르기 때문이다.",
        "둘째, 블로그의 요약과 논문의 표는 뉘앙스가 다를 수 있다. Google Research 블로그는 대중 전달을 위해 3비트, 최소 6배 절감, 최대 8배 속도 향상 같은 문장을 사용한다. 반면 TurboQuant 논문 본문은 2.5비트와 3.5비트 effective setting, 최소 4.5배 수준의 압축, 특정 Figure와 Table에 따른 결과를 더 세밀하게 적는다. 둘은 충돌이라기보다, 하나는 기술 요약이고 다른 하나는 실험 문맥이 다른 세부 결과라고 보는 편이 맞다.",
        "셋째, 모델과 벤치마크 범위도 한정적이다. 논문들은 Llama-3.1-8B-Instruct, Ministral-7B-Instruct, Gemma, Mistral, GloVe, OpenAI 임베딩 데이터셋 등을 사용해 강한 결과를 보였지만, 모든 사내 모델이나 모든 서빙 스택에서 똑같은 숫자가 재현된다고 보장하지는 않는다. 특히 실제 프로덕션에서는 배치 전략, 캐시 관리, 하드웨어, 커널 구현, 세션 길이 분포가 성능을 크게 바꾼다.",
        "넷째, 품질 중립이라는 표현도 절대적이기보다 실험 조건 안에서 이해해야 한다. 예를 들어 TurboQuant 초록은 3.5 bits per channel에서 quality neutrality를 말하고, PolarQuant는 LongBench 평균이 Full Cache에 매우 가깝다. 이는 매우 강한 결과지만, 모든 다운스트림 태스크에서 모든 사용자 프롬프트에 완전히 동일하다는 뜻으로 읽으면 과장이 된다. 좋은 보고서는 인상적인 결과를 인정하되, 적용 범위를 정확히 말해야 한다.",
      ],
      bullets: [
        "같은 비트 수라도 압축 대상과 메타데이터 비용이 다르면 의미가 다르다.",
        "블로그 요약과 논문 표의 표현 차이는 실험 문맥 차이로 읽어야 한다.",
        "프로덕션 성능은 커널, 배치, 세션 길이 분포 등 시스템 변수에 크게 좌우된다.",
        "품질 중립은 실험 범위 안에서의 표현이지 모든 경우의 절대 보증은 아니다.",
      ],
      source: "세 논문 공통, Google Research 블로그 2026-03-24",
    },
    {
      id: "conclusion",
      kicker: "13. 결론",
      title: "결국 이 연구들이 말하는 것은 '더 적은 비트'가 아니라 '더 싼 기억'이다",
      lens: "사실+해석",
      summary:
        "QJL, PolarQuant, TurboQuant는 서로 다른 수학적 길을 택했지만, 모두 LLM이 과거를 기억하는 비용을 낮추려는 연구라는 점에서 만난다.",
      paragraphs: [
        "QJL은 가장 날카로운 방식으로 묻는다. '정말 필요한 정보만 남기면 key를 얼마나 싸게 저장할 수 있는가?' PolarQuant는 표현을 바꾸면 압축이 더 예뻐질 수 있다고 말한다. TurboQuant는 이런 통찰을 더 넓은 벡터 양자화 문제와 연결한다. 셋의 차이는 분명하지만, 결국 모두 같은 질문을 변주하고 있다. 긴 문맥 시대의 LLM은 기억을 더 많이 필요로 하는데, 그 기억을 더 싼 비용으로 보관할 수 있는가라는 질문이다.",
        "이 질문이 중요한 이유는 기술 지표 하나가 아니라 제품 경쟁력 전체를 흔들 수 있기 때문이다. 메모리 비용이 줄면 긴 문맥 기능이 더 흔해질 수 있고, 지연시간이 줄면 사용자 경험이 나아질 수 있으며, 동시 처리량이 늘면 가격 정책도 달라질 수 있다. 다시 말해, KV 캐시 압축은 연구 논문 속의 뒷단 최적화가 아니라 LLM 제품의 경제성을 바꾸는 레버가 될 수 있다.",
        "그래서 이 계열 기술을 보는 가장 좋은 관점은 '양자화 기법 하나 더 나왔다'가 아니다. 오히려 'LLM이 기억을 저장하는 방식이 점점 더 영리해지고 있다'라고 보는 편이 정확하다. 앞으로 긴 문맥, 에이전트, 벡터 검색이 계속 중요해질수록, 이런 연구는 모델 자체의 성능 못지않게 중요한 경쟁 축으로 남을 가능성이 크다.",
      ],
      callout: {
        title: "마지막 한 문장",
        body:
          "좋은 KV 캐시 압축은 단순한 메모리 절약이 아니라, 더 긴 문맥을 더 낮은 비용으로 서비스하게 만드는 기반 기술이다.",
      },
      source: "세 논문 공통 비교, Google Research 블로그 2026-03-24",
    },
  ] as ReportSection[],
  comparison: [
    {
      method: "QJL",
      target: "주로 key 압축과 inner product 추정",
      easyExplanation:
        "벡터의 정확한 숫자 대신 sign만 남기는 초간단 스케치를 저장한다.",
      memoryBenefit:
        "scale, zero point 같은 보정 상수를 크게 줄여 zero-overhead 성격을 노린다.",
      businessMeaning:
        "아주 적은 비트로 key를 저장할 수 있으면 긴 문맥 세션을 더 많이 수용할 여지가 생긴다.",
      caution:
        "key 중심 설계라 value 처리나 전체 시스템 구현까지 함께 봐야 한다.",
    },
    {
      method: "PolarQuant",
      target: "KV 벡터의 angle 구조",
      easyExplanation:
        "좌표값 자체보다 회전 후 angle 정보를 저장하는 쪽이 더 예쁜 분포를 만든다고 본다.",
      memoryBenefit:
        "정규화 메타데이터 부담을 줄이며 높은 품질을 유지하려 한다.",
      businessMeaning:
        "품질 손실을 크게 늘리지 않고 긴 문맥 기능을 제공하고 싶은 제품에 매력적이다.",
      caution:
        "변환과 복원 계산이 더 복잡하고 prefill 시간 증가를 함께 봐야 한다.",
    },
    {
      method: "TurboQuant",
      target: "일반 벡터 양자화, KV 캐시, 벡터 검색",
      easyExplanation:
        "큰 윤곽은 효율적으로 저장하고, 남은 오차만 작게 보정하는 2단계 압축이다.",
      memoryBenefit:
        "낮은 비트에서 near-optimal distortion을 노리며 KV 캐시와 검색 모두에 적용 범위를 넓힌다.",
      businessMeaning:
        "추론 인프라와 벡터 검색 인프라를 동시에 최적화해야 하는 기업에 전략적 의미가 크다.",
      caution:
        "effective bit 설정과 outlier 처리 때문에 단순 비트 숫자 비교는 위험하다.",
    },
  ] as ComparisonRow[],
  metrics: [
    {
      label: "QJL 초록 요약",
      value: "3비트, 5배 이상 절감",
      body:
        "QJL 초록은 KV 캐시를 3비트 수준으로 줄이면서 5배 이상의 메모리 감소와 빠른 런타임을 보고한다.",
      source: "QJL p.1",
    },
    {
      label: "PolarQuant 초록 요약",
      value: "4.2배 이상 압축",
      body:
        "PolarQuant 초록은 4.2배 이상의 KV 캐시 압축과 최고 품질을 요약한다.",
      source: "PolarQuant p.1",
    },
    {
      label: "PolarQuant LongBench 평균",
      value: "48.11 vs Full 48.63",
      body:
        "13쪽 Table 1에서 Full Cache 평균 48.63에 매우 가까운 수준으로 보고된다.",
      source: "PolarQuant p.13 Table 1",
    },
    {
      label: "TurboQuant 이론 요약",
      value: "약 2.7배 상수 요인",
      body:
        "정보이론적 lower bound에 작은 상수배 차이로 접근한다고 초록에서 주장한다.",
      source: "TurboQuant p.1",
    },
    {
      label: "TurboQuant 품질 구간",
      value: "3.5 bits 중립, 2.5 bits 미세 저하",
      body:
        "초록과 LongBench 실험은 3.5 bits per channel에서 품질 중립, 2.5 bits에서 약간의 저하를 설명한다.",
      source: "TurboQuant p.1, p.18-20",
    },
    {
      label: "TurboQuant Needle 점수",
      value: "0.997",
      body:
        "Figure 4에서 TurboQuant는 Full-Precision 0.997과 동일한 점수로 제시된다.",
      source: "TurboQuant p.19 Figure 4",
    },
    {
      label: "TurboQuant 양자화 시간",
      value: "0.0007s / 0.0013s / 0.0021s",
      body:
        "d=200, 1536, 3072에서 PQ와 RabitQ 대비 매우 짧은 quantization time이 보고된다.",
      source: "TurboQuant p.20 Table 2",
    },
    {
      label: "Google Research 블로그 요약",
      value: "최소 6배 절감, 최대 8배 속도 향상",
      body:
        "블로그는 TurboQuant를 대중적으로 설명하며 이 수치를 강조한다. 이는 논문 표의 세부 수치와는 표현 방식이 다르다.",
      source: "Google Research 블로그 lines 245-252",
    },
  ] as MetricItem[],
  references: [
    {
      title: "QJL: 1-Bit Quantized JL Transform for KV Cache Quantization with Zero Overhead",
      kind: "paper",
      date: "2024-07-19",
      url: "https://arxiv.org/abs/2406.03482",
      note:
        "key를 랜덤 투영 후 sign-bit로 저장해 zero-overhead 성격의 KV 캐시 압축을 제안한 논문.",
    },
    {
      title: "PolarQuant: Quantizing KV Caches with Polar Transformation",
      kind: "paper",
      date: "2025-02-04",
      url: "https://arxiv.org/abs/2502.02617",
      note:
        "random preconditioning과 polar transformation을 결합해 angle 중심 KV 캐시 압축을 제안한 논문.",
    },
    {
      title: "TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate",
      kind: "paper",
      date: "2025-04-28",
      url: "https://arxiv.org/abs/2504.19874",
      note:
        "near-optimal distortion rate를 목표로 한 온라인 벡터 양자화 논문으로, KV 캐시와 벡터 검색 모두를 다룬다.",
    },
    {
      title: "TurboQuant: Redefining AI efficiency with extreme compression",
      kind: "blog",
      date: "2026-03-24",
      url: "https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/",
      note:
        "Google Research가 TurboQuant, QJL, PolarQuant를 함께 소개한 공식 블로그 글.",
    },
  ] as ReferenceItem[],
} as const;
