const categories = ['All', 'Outer', 'Top', 'Bottom', 'Shoes', 'Bag']

const featuredProducts = [
  {
    id: 1,
    brand: 'NEUTRA STUDIO',
    name: 'Washed Leather Blouson',
    price: '189,000원',
    badge: 'NEW',
    tone: 'charcoal',
  },
  {
    id: 2,
    brand: 'OFF GRID',
    name: 'Utility Parachute Pants',
    price: '94,000원',
    badge: 'BEST',
    tone: 'sand',
  },
  {
    id: 3,
    brand: 'MELLOW FORM',
    name: 'Soft Knit Zip Hoodie',
    price: '76,000원',
    badge: 'LIMITED',
    tone: 'olive',
  },
  {
    id: 4,
    brand: 'RAW ROUTE',
    name: 'Vintage Runner Sneakers',
    price: '128,000원',
    badge: 'RESTOCK',
    tone: 'stone',
  },
]

const editorialPicks = [
  {
    title: '봄 아우터 기획전',
    description: '가벼운 레더, 바람막이, 블루종 중심으로 지금 입기 좋은 실루엣을 모았습니다.',
  },
  {
    title: '톤다운 컬러 셀렉션',
    description: '블랙, 카키, 샌드, 그레이처럼 코디에 바로 섞기 쉬운 색감 위주로 구성했습니다.',
  },
]

const rankings = [
  { rank: '01', name: 'Wide Denim', brand: 'Morrow' },
  { rank: '02', name: 'Track Windbreaker', brand: 'Archive Unit' },
  { rank: '03', name: 'Square Shoulder Bag', brand: 'Luma' },
  { rank: '04', name: 'Heavy Cotton Tee', brand: 'Noble Standard' },
]

const cartItems = [
  { name: 'Washed Leather Blouson', option: 'Black / M', price: '189,000원' },
  { name: 'Vintage Runner Sneakers', option: 'Grey / 270', price: '128,000원' },
]

function SectionHeader({ label, title, description }) {
  return (
    <header className="section-header">
      <p>{label}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </header>
  )
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className={`product-thumb ${product.tone}`}>
        <span className="product-badge">{product.badge}</span>
      </div>
      <div className="product-copy">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <strong>{product.price}</strong>
      </div>
    </article>
  )
}

export default function App() {
  return (
    <main className="store-shell">
      <div className="noise-grid" />

      <header className="topbar">
        <p className="logo">THREAD ROOM</p>
        <nav className="topnav">
          <a href="#new-arrivals">NEW</a>
          <a href="#curation">CURATION</a>
          <a href="#ranking">RANKING</a>
          <a href="#cart">CART</a>
        </nav>
      </header>

      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">2026 Spring Edit</p>
          <h1>무신사 감성으로 보는 패션 커머스 홈 화면</h1>
          <p className="hero-text">
            실제 쇼핑몰처럼 보이도록 브랜드 무드, 상품 카드, 랭킹, 기획전, 장바구니 요약을 한 화면에 담은
            React 데모입니다.
          </p>
          <div className="hero-actions">
            <a className="filled-button" href="#new-arrivals">
              신상품 보기
            </a>
            <a className="ghost-button" href="#ranking">
              랭킹 보기
            </a>
          </div>
        </div>

        <aside className="hero-side">
          <div className="hero-panel dark-panel">
            <p className="panel-label">Drop Of The Week</p>
            <h2>Urban Light Outerwear</h2>
            <span>가벼운 텍스처와 어두운 톤의 레이어드 스타일을 중심으로 큐레이션했습니다.</span>
          </div>
          <div className="hero-panel light-panel">
            <p className="panel-label">Style Memo</p>
            <h2>실제 서비스처럼 보이게</h2>
            <span>배너, 카드, 정보 밀도, CTA 배치를 함께 보여주는 홈 구성입니다.</span>
          </div>
        </aside>
      </section>

      <section className="category-strip" id="new-arrivals">
        {categories.map((category) => (
          <button className={`category-chip ${category === 'All' ? 'active' : ''}`} key={category} type="button">
            {category}
          </button>
        ))}
      </section>

      <section className="content-grid">
        <div className="main-column">
          <section className="section-block">
            <SectionHeader
              label="New Arrivals"
              title="지금 메인에 보여줄 상품 카드"
              description="상품 이미지가 없어도 톤과 레이아웃만으로 커머스 느낌이 나게 설계했습니다."
            />
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="editorial-grid" id="curation">
            {editorialPicks.map((pick) => (
              <article className="editorial-card" key={pick.title}>
                <p className="eyebrow">Curated Edit</p>
                <h3>{pick.title}</h3>
                <span>{pick.description}</span>
              </article>
            ))}
          </section>
        </div>

        <aside className="side-column">
          <section className="side-panel" id="ranking">
            <SectionHeader
              label="Ranking"
              title="실시간 인기 아이템"
              description="쇼핑몰 홈에서 자주 보이는 랭킹 박스를 단순한 구조로 넣었습니다."
            />
            <div className="ranking-list">
              {rankings.map((item) => (
                <article className="ranking-item" key={item.rank}>
                  <strong>{item.rank}</strong>
                  <div>
                    <h3>{item.name}</h3>
                    <span>{item.brand}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="side-panel" id="cart">
            <SectionHeader
              label="Cart Preview"
              title="장바구니 미리보기"
              description="사용자가 바로 결제로 이어질 수 있게 요약 정보를 작게 보여줍니다."
            />
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.name}>
                  <div className="cart-thumb" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.option}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
            <div className="cart-total">
              <span>Total</span>
              <strong>317,000원</strong>
            </div>
            <button className="filled-button full-width" type="button">
              결제 진행
            </button>
          </section>
        </aside>
      </section>
    </main>
  )
}
