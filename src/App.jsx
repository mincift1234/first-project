import { useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { categories, editorialPicks, products, rankings } from './data/products'

function formatPrice(value) {
  return new Intl.NumberFormat('ko-KR').format(value) + '원'
}

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
      <Link className={`product-thumb ${product.tone}`} to={`/products/${product.id}`}>
        <span className="product-badge">{product.badge}</span>
      </Link>
      <div className="product-copy">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <strong>{formatPrice(product.price)}</strong>
      </div>
    </article>
  )
}

function Layout({ cartCount, children }) {
  return (
    <main className="store-shell">
      <div className="noise-grid" />

      <header className="topbar">
        <Link className="logo-link" to="/">
          <p className="logo">THREAD ROOM</p>
        </Link>
        <nav className="topnav">
          <Link to="/">HOME</Link>
          <Link to="/#new-arrivals">NEW</Link>
          <Link to="/#curation">CURATION</Link>
          <Link to="/cart">CART ({cartCount})</Link>
        </nav>
      </header>

      {children}
    </main>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">2026 Spring Edit</p>
          <h1>무신사 감성으로 보는 패션 커머스 홈 화면</h1>
          <p className="hero-text">
            실제 쇼핑몰처럼 보이도록 브랜드 무드, 상품 카드, 랭킹, 기획전, 장바구니 흐름을 React로 연습하는
            데모입니다.
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
              description="카드를 누르면 상세 페이지로 이동하도록 연결했습니다."
            />
            <div className="product-grid">
              {products.map((product) => (
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
        </aside>
      </section>
    </>
  )
}

function ProductDetailPage({ onAddToCart }) {
  const { productId } = useParams()
  const [selectedSize, setSelectedSize] = useState('')
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return (
      <section className="page-panel empty-page">
        <h1>상품을 찾을 수 없습니다.</h1>
        <Link className="filled-button" to="/">
          홈으로 돌아가기
        </Link>
      </section>
    )
  }

  const size = selectedSize || product.sizes[0]

  return (
    <section className="page-panel product-detail-page">
      <div className={`detail-thumb ${product.tone}`}>
        <span className="product-badge">{product.badge}</span>
      </div>

      <div className="detail-copy">
        <p className="detail-brand">{product.brand}</p>
        <h1>{product.name}</h1>
        <strong>{formatPrice(product.price)}</strong>
        <p className="detail-description">{product.description}</p>

        <div className="detail-block">
          <span className="detail-label">사이즈 선택</span>
          <div className="size-grid">
            {product.sizes.map((item) => (
              <button
                className={`size-chip ${size === item ? 'active' : ''}`}
                key={item}
                onClick={() => setSelectedSize(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-block">
          <span className="detail-label">상품 포인트</span>
          <ul className="detail-list">
            {product.details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detail-actions">
          <button className="filled-button" onClick={() => onAddToCart(product, size)} type="button">
            장바구니 담기
          </button>
          <Link className="ghost-dark-button" to="/cart">
            장바구니 보기
          </Link>
        </div>
      </div>
    </section>
  )
}

function CartPage({ cartItems }) {
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems],
  )

  return (
    <section className="page-panel cart-page">
      <SectionHeader
        label="Cart"
        title="장바구니"
        description="상세 페이지에서 담은 상품이 여기에 쌓이도록 가장 기본적인 상태 관리를 붙였습니다."
      />

      {cartItems.length === 0 ? (
        <div className="empty-page">
          <h1>장바구니가 비어 있습니다.</h1>
          <Link className="filled-button" to="/">
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <div className="cart-list-panel">
            {cartItems.map((item) => (
              <article className="cart-line" key={item.cartId}>
                <div className={`cart-preview ${item.tone}`} />
                <div>
                  <p className="detail-brand">{item.brand}</p>
                  <h3>{item.name}</h3>
                  <span>선택 옵션: {item.size}</span>
                </div>
                <strong>{formatPrice(item.price)}</strong>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <p className="panel-label">Order Summary</p>
            <h2>{formatPrice(totalPrice)}</h2>
            <span>총 상품 수 {cartItems.length}개</span>
            <button className="filled-button full-width" type="button">
              주문 계속하기
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

export default function App() {
  const [cartItems, setCartItems] = useState([])

  function handleAddToCart(product, size) {
    setCartItems((prev) => [
      ...prev,
      {
        cartId: `${product.id}-${size}-${prev.length + 1}`,
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size,
        tone: product.tone,
      },
    ])
  }

  return (
    <BrowserRouter>
      <Layout cartCount={cartItems.length}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<ProductDetailPage onAddToCart={handleAddToCart} />} path="/products/:productId" />
          <Route element={<CartPage cartItems={cartItems} />} path="/cart" />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
