export type HeroStat = {
  label: string;
  value: string;
  note: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  note: string;
};

export type OverviewCard = {
  title: string;
  body: string;
};

export type SectionItem = {
  id: string;
  label: string;
  title: string;
  summary: string;
  bullets: string[];
  analogy?: string;
  source: string;
};

export type ComparisonRow = {
  method: string;
  focus: string;
  idea: string;
  strength: string;
  caution: string;
  source: string;
};

export type MetricItem = {
  label: string;
  value: string;
  description: string;
  source: string;
};

export type CaveatItem = {
  title: string;
  detail: string;
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
  title: "TurboQuant, QJL, PolarQuant 한국어 분석 보고서",
  subtitle:
    "Google Research 공식 블로그와 논문 3편을 바탕으로 KV 캐시 압축 기술의 흐름을 학부생 수준에서 설명한 웹 보고서",
  updatedAt: "2026-03-26",
  heroTakeaway:
    "세 기술의 공통점은 단순히 비트 수를 줄이는 것이 아니라, scale·zero point·codebook 같은 숨은 오버헤드까지 함께 줄이려는 데 있다.",
  intro:
    "QJL은 2024년 7월 19일, PolarQuant는 2025년 2월 4일, TurboQuant는 2025년 4월 28일 공개되었고, Google Research는 2026년 3월 24일 공식 블로그 글로 이 계열 연구를 대중적으로 정리했다.",
  heroStats: [
    {
      label: "근거 자료",
      value: "4개",
      note: "논문 3편 + Google Research 블로그 1건",
    },
    {
      label: "핵심 문제",
      value: "KV 캐시 병목",
      note: "긴 문맥 추론에서 메모리와 대역폭이 급증한다.",
    },
    {
      label: "설명 수준",
      value: "학부생",
      note: "수식보다 원리와 비교에 집중했다.",
    },
    {
      label: "확장 범위",
      value: "LLM + 벡터 검색",
      note: "TurboQuant는 KV 캐시를 넘어 벡터 검색까지 겨냥한다.",
    },
  ] as HeroStat[],
  timeline: [
    {
      date: "2024-07-19",
      title: "QJL",
      note: "JL 랜덤 투영과 1비트 sign 저장으로 zero-overhead 성격의 key 압축을 제안했다.",
    },
    {
      date: "2025-02-04",
      title: "PolarQuant",
      note: "랜덤 회전과 극좌표 변환을 결합해 angle 중심 KV 캐시 양자화를 제안했다.",
    },
    {
      date: "2025-04-28",
      title: "TurboQuant",
      note: "온라인 벡터 양자화 관점에서 near-optimal distortion rate를 목표로 한 일반화된 틀을 제시했다.",
    },
    {
      date: "2026-03-24",
      title: "Google Research 블로그",
      note: "TurboQuant, QJL, PolarQuant를 하나의 계열 기술로 묶어 대중적으로 설명했다.",
    },
  ] as TimelineItem[],
  overviewCards: [
    {
      title: "왜 중요한가",
      body:
        "LLM은 새 토큰을 생성할 때 이전 토큰의 key와 value를 다시 계산하지 않으려고 KV 캐시를 저장한다. 문맥이 길어질수록 이 캐시가 매우 커져 메모리 비용과 지연 시간이 함께 늘어난다.",
    },
    {
      title: "무엇이 달라졌나",
      body:
        "기존 양자화는 비트 수를 줄여도 block마다 scale과 zero point를 저장해야 했다. 이 연구들은 그 숨은 비용까지 압축 목표에 포함시킨다.",
    },
    {
      title: "세 논문의 관계",
      body:
        "QJL은 내적 보존과 zero-overhead에 강하고, PolarQuant는 angle 구조를 이용해 정규화 부담을 줄이며, TurboQuant는 이 흐름을 더 일반적인 벡터 양자화 이론으로 확장한다.",
    },
  ] as OverviewCard[],
  sections: [
    {
      id: "bottleneck",
      label: "배경",
      title: "왜 KV 캐시가 LLM 추론의 병목이 되는가",
      summary:
        "디코딩 단계에서는 이미 생성한 토큰의 key와 value를 계속 보관해야 한다. 그래서 문맥 길이가 길어질수록 캐시 크기가 커지고, 메모리 이동 비용도 커진다.",
      bullets: [
        "캐시 크기는 레이어 수, 헤드 수, 문맥 길이에 비례해서 늘어난다.",
        "문제는 저장 공간만이 아니다. GPU가 캐시를 불러오는 대역폭 비용도 함께 커진다.",
        "그래서 좋은 압축 기법은 정확도뿐 아니라 실제 추론 속도와 메모리 오버헤드도 함께 봐야 한다.",
      ],
      source: "QJL p.1-3, TurboQuant p.1-2",
    },
    {
      id: "qjl",
      label: "논문 1",
      title: "QJL: 부호만 남기는 1비트 key 스케치",
      summary:
        "QJL은 key 벡터에 JL 랜덤 투영을 적용한 뒤 각 좌표의 sign만 저장한다. query는 같은 투영을 거치되 양자화하지 않아서, 원래 내적을 편향 없이 추정하도록 만든다.",
      bullets: [
        "핵심 목표는 scale과 zero point 같은 block별 보정 상수를 저장하지 않는 것이다.",
        "그래서 논문 제목에 zero overhead가 들어간다.",
        "초록은 KV 캐시를 3비트 수준으로 줄이면서 메모리를 5배 이상 절약하고 정확도 저하 없이 동작했다고 요약한다.",
        "이 방법은 key 압축에 특히 초점을 맞추며, unbiased inner product estimator가 핵심 이론 결과다.",
      ],
      analogy:
        "정확한 숫자를 다 저장하는 대신, 벡터가 어느 방향을 가리키는지에 대한 윤곽선만 남기는 방식으로 이해하면 쉽다.",
      source: "QJL p.1-7, p.10-11",
    },
    {
      id: "polarquant",
      label: "논문 2",
      title: "PolarQuant: 좌표 대신 각도로 압축하는 방법",
      summary:
        "PolarQuant는 벡터를 랜덤 회전한 뒤 극좌표로 바꾸고, 반지름보다 angle 정보를 중심으로 양자화한다. 회전 후 angle 분포가 예측 가능해진다는 점을 이용해 정규화 오버헤드를 줄인다.",
      bullets: [
        "핵심 아이디어는 random preconditioning과 recursive polar transformation의 결합이다.",
        "벡터를 여러 단계의 angle로 분해해 코드북으로 저장하므로, block별 정규화 상수 의존성이 줄어든다.",
        "초록은 KV 캐시를 4.2배 이상 압축하면서 state-of-the-art 대비 가장 좋은 품질을 얻었다고 말한다.",
        "다만 LongBench 평균 점수는 좋지만, prefill 시간은 Exact나 KIVI보다 길 수 있다.",
      ],
      analogy:
        "지도에서 x축, y축 좌표를 따로 적는 대신 거리와 각도로 위치를 적는다고 생각하면 PolarQuant의 감각에 가깝다.",
      source: "PolarQuant p.1-3, p.11-14",
    },
    {
      id: "turboquant",
      label: "논문 3",
      title: "TurboQuant: 이론과 실험을 함께 확장한 최신판",
      summary:
        "TurboQuant는 온라인 벡터 양자화 문제를 더 일반적으로 다룬다. 먼저 랜덤 회전 후 좌표별 MSE 최적 양자화를 수행하고, 남은 residual에는 1비트 QJL을 적용해 inner product bias를 보정한다.",
      bullets: [
        "논문은 정보이론적 하한에 약 2.7배의 작은 상수 요인으로 접근하는 near-optimal distortion rate를 주장한다.",
        "KV 캐시 실험에서는 3.5 bits per channel에서 품질 중립, 2.5 bits per channel에서는 약간의 품질 저하를 보고한다.",
        "Needle-in-a-Haystack 실험에서 TurboQuant 점수는 0.997로 full-precision 0.997과 동일하게 보고된다.",
        "논문은 KV 캐시뿐 아니라 벡터 검색에서도 PQ와 RabitQ보다 높은 recall과 거의 0에 가까운 quantization time을 제시한다.",
      ],
      analogy:
        "먼저 벡터의 큰 윤곽을 효율적으로 저장하고, 남은 오차는 아주 작은 보정 메모로 붙이는 2단계 압축이라고 보면 된다.",
      source: "TurboQuant p.1-2, p.18-21",
    },
    {
      id: "blog",
      label: "공식 설명",
      title: "Google Research 블로그는 무엇을 강조했는가",
      summary:
        "2026년 3월 24일 공개된 Google Research 블로그는 TurboQuant를 최신 압축 기술로 소개하면서, QJL과 PolarQuant를 그 핵심 구성 아이디어로 설명했다.",
      bullets: [
        "블로그는 TurboQuant를 KV 캐시 압축과 벡터 검색을 동시에 뒷받침하는 기술로 소개한다.",
        "공식 블로그는 3비트 수준의 KV 캐시 압축, 최소 6배 수준의 메모리 절감, 그리고 H100에서 4비트 기준 최대 8배 속도 향상을 강조한다.",
        "이 표현은 연구 결과를 대중에게 설명하기 위한 요약이므로, 세부 수치는 논문 표와 함께 읽는 편이 안전하다.",
      ],
      source:
        "Google Research blog lines 218-262, published on 2026-03-24",
    },
  ] as SectionItem[],
  comparison: [
    {
      method: "QJL",
      focus: "KV 캐시의 key와 내적 추정",
      idea: "JL 투영 뒤 sign-bit만 저장하고 query는 양자화하지 않는다.",
      strength: "보정 상수 저장이 거의 필요 없고, unbiased estimator가 분명하다.",
      caution: "key 중심 설계라 value 처리와 전체 시스템 해석을 함께 봐야 한다.",
      source: "QJL p.1-7",
    },
    {
      method: "PolarQuant",
      focus: "KV 벡터 전체의 angle 구조",
      idea: "랜덤 회전 후 극좌표 angle을 재귀적으로 양자화한다.",
      strength: "정규화 오버헤드를 줄이면서 품질을 매우 잘 유지한다.",
      caution: "변환과 복원 과정이 더 복잡하고 prefill 비용이 늘 수 있다.",
      source: "PolarQuant p.1-3, p.11-14",
    },
    {
      method: "TurboQuant",
      focus: "일반 벡터 양자화, KV 캐시, 벡터 검색",
      idea: "MSE 최적 양자화 뒤 residual에 1비트 QJL을 붙인다.",
      strength: "이론적 하한, KV 캐시 실험, 검색 실험을 한 틀에서 묶는다.",
      caution: "effective bit 수가 outlier 분리에 따라 달라져 단순 숫자 비교가 어렵다.",
      source: "TurboQuant p.1-2, p.18-21",
    },
  ] as ComparisonRow[],
  metrics: [
    {
      label: "QJL 메모리 절감",
      value: "5x 이상",
      description:
        "초록은 3비트 수준의 KV 캐시에서 5배 이상의 메모리 절감을 보고한다.",
      source: "QJL p.1",
    },
    {
      label: "PolarQuant 압축률",
      value: "4.2x 이상",
      description:
        "초록은 KV 캐시를 4.2배 이상 압축하면서도 최고 품질을 달성했다고 요약한다.",
      source: "PolarQuant p.1",
    },
    {
      label: "PolarQuant LongBench 평균",
      value: "48.11",
      description:
        "Full Cache 48.63과 매우 가까운 수준으로 보고된다.",
      source: "PolarQuant p.13 Table 1",
    },
    {
      label: "TurboQuant 이론 갭",
      value: "약 2.7배",
      description:
        "정보이론적 lower bound에 작은 상수 요인으로 접근한다고 주장한다.",
      source: "TurboQuant p.1",
    },
    {
      label: "TurboQuant 품질 구간",
      value: "3.5 bits / 2.5 bits",
      description:
        "3.5 bits per channel은 품질 중립, 2.5 bits per channel은 미세한 품질 저하로 설명된다.",
      source: "TurboQuant p.1, p.18-20",
    },
    {
      label: "TurboQuant Needle 점수",
      value: "0.997",
      description:
        "Figure 4에서 full-precision 0.997과 동일한 점수로 보고된다.",
      source: "TurboQuant p.19",
    },
    {
      label: "TurboQuant 양자화 시간",
      value: "0.0007s / 0.0013s / 0.0021s",
      description:
        "d=200, 1536, 3072에서 PQ보다 압도적으로 빠른 양자화 시간을 보인다.",
      source: "TurboQuant p.20 Table 2",
    },
    {
      label: "공식 블로그 속도 주장",
      value: "최대 8x",
      description:
        "Google Research 블로그는 H100에서 4비트 TurboQuant가 32비트 key 대비 최대 8배 속도 향상을 보였다고 설명한다.",
      source: "Google Research blog lines 247-252",
    },
  ] as MetricItem[],
  takeaways: [
    "QJL은 'sign만 남겨도 내적을 복원할 수 있는가'에 대한 대답이다.",
    "PolarQuant는 '좌표 대신 angle을 저장하면 정규화 부담을 더 줄일 수 있는가'에 대한 대답이다.",
    "TurboQuant는 '이런 아이디어를 더 일반적인 벡터 양자화 이론으로 확장할 수 있는가'에 대한 대답이다.",
    "세 논문은 모두 압축률만이 아니라 실제 추론 오버헤드와 하드웨어 친화성을 중시한다.",
    "같은 비트 수라도 대상이 key인지, KV 전체인지, residual을 어떻게 다루는지에 따라 의미가 달라진다.",
  ],
  caveats: [
    {
      title: "같은 비트 수를 그대로 비교하면 오해할 수 있다",
      detail:
        "QJL, PolarQuant, TurboQuant는 압축 대상과 계산 목표가 다르다. key만 강하게 압축하는지, value까지 포함하는지, inner product bias를 어떻게 다루는지를 같이 봐야 한다.",
      source: "세 논문 공통",
    },
    {
      title: "블로그의 3비트 표현은 논문 표의 2.5/3.5비트와 뉘앙스가 다르다",
      detail:
        "TurboQuant 논문 표는 outlier channel 분리를 반영한 effective bit를 사용한다. 블로그는 이를 더 단순한 대중 설명으로 요약한다.",
      source: "TurboQuant p.18-20, Google Research blog 2026-03-24",
    },
    {
      title: "모델과 벤치마크가 제한적이다",
      detail:
        "논문들은 Llama-3.1-8B-Instruct, Ministral-7B-Instruct, Gemma, Mistral 등 공개 모델 중심으로 평가했다. 모든 서비스 모델에 동일한 결과가 자동으로 보장되는 것은 아니다.",
      source: "PolarQuant p.13-14, TurboQuant p.18-21, Google Research blog lines 240-257",
    },
    {
      title: "TurboQuant는 public summary와 paper framing이 조금 다르다",
      detail:
        "블로그는 TurboQuant의 1단계를 PolarQuant 계열 직관으로 설명하지만, 논문은 rotated coordinates와 scalar quantizer를 통한 정보이론 관점으로 더 일반적으로 서술한다.",
      source: "TurboQuant p.1-2, Google Research blog lines 222-239",
    },
  ] as CaveatItem[],
  references: [
    {
      title: "QJL: 1-Bit Quantized JL Transform for KV Cache Quantization with Zero Overhead",
      kind: "paper",
      date: "2024-07-19",
      url: "https://arxiv.org/abs/2406.03482",
      note: "JL 랜덤 투영과 1비트 sign sketch를 이용한 key 중심 KV 캐시 압축 논문.",
    },
    {
      title: "PolarQuant: Quantizing KV Caches with Polar Transformation",
      kind: "paper",
      date: "2025-02-04",
      url: "https://arxiv.org/abs/2502.02617",
      note: "극좌표 angle 구조를 이용해 정규화 오버헤드를 줄이려는 KV 캐시 압축 논문.",
    },
    {
      title: "TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate",
      kind: "paper",
      date: "2025-04-28",
      url: "https://arxiv.org/abs/2504.19874",
      note: "near-optimal distortion rate를 목표로 한 온라인 벡터 양자화 논문.",
    },
    {
      title: "TurboQuant: Redefining AI efficiency with extreme compression",
      kind: "blog",
      date: "2026-03-24",
      url: "https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/",
      note: "Google Research가 TurboQuant, QJL, PolarQuant를 함께 소개한 공식 블로그 글.",
    },
  ] as ReferenceItem[],
} as const;
