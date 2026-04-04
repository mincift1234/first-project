import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import { categories, editorialPicks, products, rankings } from './data/products'

const CART_STORAGE_KEY = 'thread-room-cart'
const WISHLIST_STORAGE_KEY = 'thread-room-wishlist'

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price-asc', label: '가격 낮은순' },
  { value: 'price-desc', label: '가격 높은순' },
]

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

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

function WishlistButton({ active, onToggle }) {
  return (
    <button
      aria-label={active ? '찜 해제' : '찜하기'}
      className={`wishlist-button ${active ? 'active' : ''}`}
      onClick={onToggle}
      type="button"
    >
      ♥
    </button>
  )
}

function ProductCard({ product, isLiked, onToggleWishlist }) {
  return (
    <article className="product-card">
      <div className={`product-thumb ${product.tone}`}>
        <span className="product-badge">{product.badge}</span>
        <WishlistButton
          active={isLiked}
          onToggle={(event) => {
            event.stopPropagation()
            onToggleWishlist(product.id)
          }}
        />
        <Link className="thumb-link" to={`/products/${product.id}`} />
      </div>
      <div className="product-copy">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <strong>{formatPrice(product.price)}</strong>
      </div>
    </article>
  )
}

function buildProductsLink(category, sort) {
  const params = new URLSearchParams()

  if (category && category !== 'All') {
    params.set('category', category)
  }

  if (sort && sort !== 'latest') {
    params.set('sort', sort)
  }

  const query = params.toString()
  return query ? `/products?${query}` : '/products'
}

function CategoryFilter({ activeCategory, activeSort }) {
  return (
    <section className="category-strip">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const target = buildProductsLink(category, activeSort)

        return (
          <Link className={`category-chip ${isActive ? 'active' : ''}`} key={category} to={target}>
            {category}
          </Link>
        )
      })}
    </section>
  )
}

function Layout({ cartCount, wishlistCount, children }) {
  return (
    <main className="store-shell">
      <div className="noise-grid" />

      <header className="topbar">
        <Link className="logo-link" to="/">
          <p className="logo">THREAD ROOM</p>
        </Link>
        <nav className="topnav">
          <Link to="/">HOME</Link>
          <Link to="/products">SHOP</Link>
          <Link to="/products?category=Outer">OUTER</Link>
          <Link to="/wishlist">LIKE ({wishlistCount})</Link>
          <Link to="/cart">CART ({cartCount})</Link>
        </nav>
      </header>

      {children}
    </main>
  )
}

function HomePage({ likedIds, onToggleWishlist }) {
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
            <Link className="filled-button" to="/products">
              전체 상품 보기
            </Link>
            <Link className="ghost-button" to="/products?category=Outer">
              아우터 보기
            </Link>
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
          <Link
            className={`category-chip ${category === 'All' ? 'active' : ''}`}
            key={category}
            to={category === 'All' ? '/products' : `/products?category=${category}`}
          >
            {category}
          </Link>
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
                <ProductCard
                  isLiked={likedIds.includes(product.id)}
                  key={product.id}
                  onToggleWishlist={onToggleWishlist}
                  product={product}
                />
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

function ProductsPage({ likedIds, onToggleWishlist }) {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const sortParam = searchParams.get('sort')
  const activeCategory = categories.includes(categoryParam) ? categoryParam : 'All'
  const activeSort = sortOptions.some((option) => option.value === sortParam) ? sortParam : 'latest'

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === 'All'
        ? [...products]
        : products.filter((product) => product.category === activeCategory)

    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    }

    if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [activeCategory, activeSort])

  return (
    <section className="page-panel products-page">
      <SectionHeader
        label="Shop"
        title="상품 리스트"
        description="카테고리를 누르면 URL이 바뀌고, 그 값에 맞는 상품만 보이도록 연결했습니다."
      />

      <CategoryFilter activeCategory={activeCategory} activeSort={activeSort} />

      <div className="products-toolbar">
        <span>
          현재 카테고리: <strong>{activeCategory}</strong>
        </span>
        <div className="toolbar-group">
          <span>총 {visibleProducts.length}개 상품</span>
          <div className="sort-tabs">
            {sortOptions.map((option) => (
              <Link
                className={`sort-chip ${activeSort === option.value ? 'active' : ''}`}
                key={option.value}
                to={buildProductsLink(activeCategory, option.value)}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="product-grid product-grid-wide">
        {visibleProducts.map((product) => (
          <ProductCard
            isLiked={likedIds.includes(product.id)}
            key={product.id}
            onToggleWishlist={onToggleWishlist}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}

function ProductDetailPage({ likedIds, onAddToCart, onToggleWishlist }) {
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
  const isLiked = likedIds.includes(product.id)

  return (
    <section className="page-panel product-detail-page">
      <div className={`detail-thumb ${product.tone}`}>
        <span className="product-badge">{product.badge}</span>
        <WishlistButton active={isLiked} onToggle={() => onToggleWishlist(product.id)} />
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

function CartPage({ cartItems, onDecreaseQuantity, onIncreaseQuantity, onRemoveCartItem }) {
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
                  <div className="quantity-controls">
                    <button className="quantity-button" onClick={() => onDecreaseQuantity(item.cartId)} type="button">
                      -
                    </button>
                    <strong>{item.quantity}</strong>
                    <button className="quantity-button" onClick={() => onIncreaseQuantity(item.cartId)} type="button">
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-line-actions">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button className="remove-button" onClick={() => onRemoveCartItem(item.cartId)} type="button">
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <p className="panel-label">Order Summary</p>
            <h2>{formatPrice(totalPrice)}</h2>
            <span>총 상품 수 {cartItems.reduce((sum, item) => sum + item.quantity, 0)}개</span>
            <button className="filled-button full-width" type="button">
              주문 계속하기
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

function WishlistPage({ likedIds, onToggleWishlist }) {
  const likedProducts = products.filter((product) => likedIds.includes(product.id))

  return (
    <section className="page-panel wishlist-page">
      <SectionHeader
        label="Wishlist"
        title="찜한 상품"
        description="상품 id 배열만 따로 관리해서, 여러 화면에서 같은 찜 상태를 공유하도록 만들었습니다."
      />

      {likedProducts.length === 0 ? (
        <div className="empty-page">
          <h1>아직 찜한 상품이 없습니다.</h1>
          <Link className="filled-button" to="/products">
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <div className="product-grid product-grid-wide">
          {likedProducts.map((product) => (
            <ProductCard
              isLiked={likedIds.includes(product.id)}
              key={product.id}
              onToggleWishlist={onToggleWishlist}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function App() {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [likedIds, setLikedIds] = useState(() => readStorage(WISHLIST_STORAGE_KEY, []))

  function handleAddToCart(product, size) {
    setCartItems((prev) => [
      ...prev,
      {
        cartId: `${product.id}-${size}-${prev.length + 1}`,
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: 1,
        size,
        tone: product.tone,
      },
    ])
  }

  function handleToggleWishlist(productId) {
    setLikedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  function handleIncreaseQuantity(cartId) {
    setCartItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  function handleDecreaseQuantity(cartId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
      ),
    )
  }

  function handleRemoveCartItem(cartId) {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(likedIds))
  }, [likedIds])

  return (
    <BrowserRouter>
      <Layout cartCount={cartItems.length} wishlistCount={likedIds.length}>
        <Routes>
          <Route
            element={<HomePage likedIds={likedIds} onToggleWishlist={handleToggleWishlist} />}
            path="/"
          />
          <Route
            element={<ProductsPage likedIds={likedIds} onToggleWishlist={handleToggleWishlist} />}
            path="/products"
          />
          <Route
            element={
              <ProductDetailPage
                likedIds={likedIds}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            }
            path="/products/:productId"
          />
          <Route
            element={<WishlistPage likedIds={likedIds} onToggleWishlist={handleToggleWishlist} />}
            path="/wishlist"
          />
          <Route
            element={
              <CartPage
                cartItems={cartItems}
                onDecreaseQuantity={handleDecreaseQuantity}
                onIncreaseQuantity={handleIncreaseQuantity}
                onRemoveCartItem={handleRemoveCartItem}
              />
            }
            path="/cart"
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
