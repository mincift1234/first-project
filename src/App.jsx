const serviceHighlights = [
  {
    title: '사업이 바로 이해되는 첫 화면',
    description:
      '사이트에 들어오자마자 누가 봐도 업종, 강점, 문의 방법이 보이게 구성합니다.',
  },
  {
    title: '모바일에서 보기 편한 구조',
    description:
      '실제 방문자는 모바일이 많기 때문에 작은 화면에서도 버튼과 정보가 먼저 보이게 만듭니다.',
  },
  {
    title: '수정하기 쉬운 섹션 설계',
    description:
      '나중에 문구, 후기, 가격, 사진을 바꾸기 쉽도록 반복 가능한 섹션으로 나눠둡니다.',
  },
]

const processSteps = [
  {
    step: '01',
    title: '업종과 목표 정리',
    description: '누구에게 보여줄 사이트인지, 문의를 받을지 예약을 받을지 먼저 정합니다.',
  },
  {
    step: '02',
    title: '문구와 화면 흐름 설계',
    description: '첫 화면, 서비스 소개, 후기, 가격, 문의 섹션 순서를 잡고 카피를 맞춥니다.',
  },
  {
    step: '03',
    title: 'React로 제작',
    description: '반응형 레이아웃과 재사용 가능한 컴포넌트로 빠르게 제작합니다.',
  },
  {
    step: '04',
    title: '배포와 수정',
    description: '실제 오픈 후에도 문구와 섹션을 수정할 수 있게 구조를 정리해 전달합니다.',
  },
]

const portfolioProjects = [
  {
    category: 'PT 스튜디오',
    title: '예약 문의가 바로 보이는 소개형 사이트',
    summary:
      '가격표, 위치, 후기, 상담 신청 버튼을 메인 흐름에 넣어 첫 방문자가 바로 행동하게 만드는 구성입니다.',
    outcome: '목표: 소개 + 상담 유도',
  },
  {
    category: '카페 / 소형 매장',
    title: '분위기와 메뉴가 먼저 전달되는 브랜드 페이지',
    summary:
      '사진 중심 레이아웃으로 가게의 톤을 보여주고, 지도와 인스타그램 연결을 함께 배치합니다.',
    outcome: '목표: 방문 유도 + 브랜드 인상',
  },
  {
    category: '1인 전문가',
    title: '서비스 설명이 깔끔한 상담형 랜딩 페이지',
    summary:
      '누가, 무엇을, 어떻게 도와주는지 한 페이지 안에서 정리해 신뢰를 높이는 구조입니다.',
    outcome: '목표: 신뢰 형성 + 문의 전환',
  },
]

const pricingPlans = [
  {
    name: '기본형',
    price: '40만원부터',
    target: '처음 온라인 소개 페이지가 필요한 사장님',
    features: ['메인 소개 페이지', '서비스/소개 섹션', '모바일 최적화', '기본 문의 버튼 연결'],
  },
  {
    name: '문의형',
    price: '70만원부터',
    target: '상담 문의를 더 잘 받고 싶은 업종',
    features: ['기본형 포함', '후기/사례 섹션', '가격 또는 프로그램 소개', '문의 폼 또는 채널 연결'],
  },
  {
    name: '운영형',
    price: '120만원부터',
    target: '업데이트와 관리까지 함께 맡기고 싶은 경우',
    features: ['문의형 포함', '추가 페이지 제작', '관리용 콘텐츠 구조화', '오픈 후 수정 지원'],
  },
]

function SectionTitle({ eyebrow, title, description }) {
  return (
    <header className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </header>
  )
}

export default function App() {
  return (
    <main className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <section className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Freelance Web Portfolio</p>
          <h1>작은 사업자가 바로 문의하고 싶은 웹사이트를 만드는 개발자</h1>
          <p className="hero-description">
            React로 사이트를 만드는 초보 개발자이지만, 예쁜 화면보다 먼저
            &quot;누가 봐도 이해되고 바로 연락하게 되는 흐름&quot;을 만드는 데 집중하고 있습니다.
            소개 페이지, 상담 유도형 랜딩 페이지, 소규모 브랜드 웹사이트를 제작합니다.
          </p>

          <div className="hero-actions">
            <a className="primary-link" href="#portfolio">
              작업 예시 보기
            </a>
            <a className="secondary-link" href="#pricing">
              가격 보기
            </a>
          </div>

          <ul className="hero-points">
            <li>업종에 맞는 문구와 섹션 순서를 같이 정리합니다.</li>
            <li>모바일에서도 읽기 쉬운 구조로 제작합니다.</li>
            <li>수정이 쉬운 React 컴포넌트 구조를 기준으로 만듭니다.</li>
          </ul>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Positioning</p>
          <h2>React로 만드는 1인 웹 제작 서비스</h2>
          <div className="hero-metrics">
            <article>
              <strong>1</strong>
              <span>업종에 집중한 설계</span>
            </article>
            <article>
              <strong>3</strong>
              <span>판매용 샘플 콘셉트</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>모바일 우선 레이아웃</span>
            </article>
          </div>

          <div className="quote-card">
            <p>사이트는 코드 자랑용이 아니라, 사업 소개와 문의를 더 쉽게 만드는 도구여야 합니다.</p>
          </div>
        </aside>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="What I Build"
          title="이런 목적의 사이트를 만들고 싶습니다"
          description="지금은 아무 사이트나 만드는 사람보다, 소규모 사업자를 위한 실전형 페이지를 만드는 사람으로 보이게 구성했습니다."
        />
        <div className="feature-grid">
          {serviceHighlights.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid section-split" id="portfolio">
        <SectionTitle
          eyebrow="Portfolio Concepts"
          title="판매용으로 보여줄 작업 예시"
          description="아직 실제 고객 작업이 많지 않아도, 업종별 샘플 콘셉트를 잘 만들면 충분히 포트폴리오 역할을 할 수 있습니다."
        />
        <div className="portfolio-list">
          {portfolioProjects.map((project) => (
            <article className="portfolio-card" key={project.title}>
              <p className="card-tag">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <strong>{project.outcome}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="Process"
          title="작업은 이런 순서로 진행합니다"
          description="이 섹션은 실력보다 신뢰를 보여주는 역할을 합니다. 의뢰인은 작업 흐름이 보이면 더 안심합니다."
        />
        <div className="process-grid">
          {processSteps.map((item) => (
            <article className="process-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid" id="pricing">
        <SectionTitle
          eyebrow="Pricing"
          title="가격은 단순하게 보여줍니다"
          description="처음에는 복잡한 견적표보다, 고객이 바로 이해할 수 있는 3단 구성으로 시작하는 편이 좋습니다."
        />
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article className="pricing-card" key={plan.name}>
              <p className="card-tag">{plan.name}</p>
              <h3>{plan.price}</h3>
              <p className="pricing-target">{plan.target}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-banner">
        <div>
          <p className="hero-eyebrow">Next Step</p>
          <h2>사업 소개가 잘 되는 첫 사이트가 필요하다면 같이 정리해드립니다</h2>
          <p>
            업종, 필요한 페이지 수, 원하는 분위기를 정리해서 맞는 랜딩 페이지 형태로 제안할 수 있습니다.
          </p>
        </div>
        <a className="primary-link" href="mailto:hello@example.com">
          문의하기
        </a>
      </section>
    </main>
  )
}
