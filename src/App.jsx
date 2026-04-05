import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { categories, editorialPicks, products, rankings } from './data/products'

const CART_STORAGE_KEY = 'thread-room-cart'
const WISHLIST_STORAGE_KEY = 'thread-room-wishlist'
const ORDER_STORAGE_KEY = 'thread-room-orders'

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'price-asc', label: '가격 낮은순' },
  { value: 'price-desc', label: '가격 높은순' },
]

const FREE_SHIPPING_THRESHOLD = 150000
const BASE_SHIPPING_FEE = 3000

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

function formatReviewCount(value) {
  return new Intl.NumberFormat('ko-KR').format(value)
}

function getOrderAmounts(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  }
}

function formatOrderDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getPaymentLabel(value) {
  if (value === 'bank') {
    return '무통장입금'
  }

  if (value === 'phone') {
    return '휴대폰결제'
  }

  return '신용카드'
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
        <div className="product-thumb-meta">
          <span>{product.delivery}</span>
          <span>리뷰 {formatReviewCount(product.reviewCount)}</span>
        </div>
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
        <div className="price-row">
          <span className="discount-rate">{product.discountRate}%</span>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <div className="product-meta-row">
          <span className="original-price">{formatPrice(product.originalPrice)}</span>
          <span>{product.delivery}</span>
        </div>
      </div>
    </article>
  )
}

function buildProductsLink(category, sort, searchQuery) {
  const params = new URLSearchParams()

  if (category && category !== 'All') {
    params.set('category', category)
  }

  if (sort && sort !== 'latest') {
    params.set('sort', sort)
  }

  if (searchQuery) {
    params.set('q', searchQuery)
  }

  const queryString = params.toString()
  return queryString ? `/products?${queryString}` : '/products'
}

function CategoryFilter({ activeCategory, activeSort, activeQuery }) {
  return (
    <section className="category-strip">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const target = buildProductsLink(category, activeSort, activeQuery)

        return (
          <Link className={`category-chip ${isActive ? 'active' : ''}`} key={category} to={target}>
            {category}
          </Link>
        )
      })}
    </section>
  )
}

function Layout({ cartCount, orderCount, wishlistCount, children }) {
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
          <Link to="/orders">ORDERS ({orderCount})</Link>
        </nav>
      </header>

      {children}
    </main>
  )
}

function HomePage({ likedIds, onToggleWishlist }) {
  const featuredProducts = products.slice(0, 6)

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
              description="가격, 할인율, 리뷰 수, 배송 메타를 같이 보여주도록 상품 카드 밀도를 높였습니다."
            />
            <div className="product-grid">
              {featuredProducts.map((product) => (
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
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const sortParam = searchParams.get('sort')
  const queryParam = searchParams.get('q') ?? ''
  const activeCategory = categories.includes(categoryParam) ? categoryParam : 'All'
  const activeSort = sortOptions.some((option) => option.value === sortParam) ? sortParam : 'latest'
  const normalizedQuery = queryParam.trim().toLowerCase()

  const visibleProducts = useMemo(() => {
    const filteredByCategory =
      activeCategory === 'All'
        ? [...products]
        : products.filter((product) => product.category === activeCategory)

    const filtered = normalizedQuery
      ? filteredByCategory.filter((product) => {
          const target = `${product.name} ${product.brand}`.toLowerCase()
          return target.includes(normalizedQuery)
        })
      : filteredByCategory

    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    }

    if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [activeCategory, activeSort, normalizedQuery])

  function handleQueryChange(event) {
    const nextQuery = event.target.value
    const nextParams = new URLSearchParams(searchParams)

    if (nextQuery.trim()) {
      nextParams.set('q', nextQuery)
    } else {
      nextParams.delete('q')
    }

    setSearchParams(nextParams)
  }

  return (
    <section className="page-panel products-page">
      <SectionHeader
        label="Shop"
        title="상품 리스트"
        description="카테고리를 누르면 URL이 바뀌고, 그 값에 맞는 상품만 보이도록 연결했습니다."
      />

      <div className="search-toolbar">
        <label className="search-field">
          <span>상품 검색</span>
          <input
            onChange={handleQueryChange}
            placeholder="브랜드 또는 상품명 검색"
            type="search"
            value={queryParam}
          />
        </label>
      </div>

      <CategoryFilter activeCategory={activeCategory} activeQuery={queryParam} activeSort={activeSort} />

      <div className="products-toolbar">
        <span>
          현재 카테고리: <strong>{activeCategory}</strong>
          {normalizedQuery ? ` / 검색어: ${queryParam}` : ''}
        </span>
        <div className="toolbar-group">
          <span>총 {visibleProducts.length}개 상품</span>
          <div className="sort-tabs">
            {sortOptions.map((option) => (
                <Link
                  className={`sort-chip ${activeSort === option.value ? 'active' : ''}`}
                  key={option.value}
                  to={buildProductsLink(activeCategory, option.value, queryParam)}
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
      {visibleProducts.length === 0 ? (
        <div className="empty-page search-empty-state">
          <h1>검색 결과가 없습니다.</h1>
          <span>다른 키워드나 카테고리 조합으로 다시 찾아보세요.</span>
        </div>
      ) : null}
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
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3)

  return (
    <section className="page-panel detail-page-shell">
      <div className="product-detail-page">
        <div className={`detail-thumb ${product.tone}`}>
          <span className="product-badge">{product.badge}</span>
          <WishlistButton active={isLiked} onToggle={() => onToggleWishlist(product.id)} />
        </div>

        <div className="detail-copy">
          <p className="detail-brand">{product.brand}</p>
          <h1>{product.name}</h1>
          <div className="detail-price-stack">
            <div className="price-row">
              <span className="discount-rate">{product.discountRate}%</span>
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          </div>
          <div className="detail-meta-strip">
            <span>{product.delivery}</span>
            <span>리뷰 {formatReviewCount(product.reviewCount)}개</span>
            <span>{product.category}</span>
          </div>
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
      </div>

      {relatedProducts.length > 0 ? (
        <section className="related-section">
          <SectionHeader
            label="Related Items"
            title={`${product.category} 카테고리 추천`}
            description="같은 무드로 함께 둘러보기 좋은 상품을 상세 하단에 연결했습니다."
          />
          <div className="product-grid product-grid-wide related-grid">
            {relatedProducts.map((item) => (
              <ProductCard
                isLiked={likedIds.includes(item.id)}
                key={item.id}
                onToggleWishlist={onToggleWishlist}
                product={item}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

function CartPage({ cartItems, onDecreaseQuantity, onIncreaseQuantity, onRemoveCartItem }) {
  const { shippingFee, subtotal, total } = useMemo(() => getOrderAmounts(cartItems), [cartItems])

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
            <div className="summary-breakdown">
              <div className="summary-line">
                <span>상품 금액</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="summary-line">
                <span>배송비</span>
                <strong>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</strong>
              </div>
            </div>
            <h2>{formatPrice(total)}</h2>
            <span>총 상품 수 {cartItems.reduce((sum, item) => sum + item.quantity, 0)}개</span>
            <span>
              {shippingFee === 0
                ? '무료배송 기준을 충족했습니다.'
                : `${formatPrice(FREE_SHIPPING_THRESHOLD)} 이상 구매 시 무료배송`}
            </span>
            <Link className="filled-button full-width summary-link" to="/checkout">
              주문 계속하기
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

function CheckoutPage({ cartItems, onClearCart, onPlaceOrder }) {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    payment: 'card',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )
  const { shippingFee, subtotal, total } = useMemo(() => getOrderAmounts(cartItems), [cartItems])

  function handleChange(event) {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

      if (cartItems.length === 0) {
        navigate('/products')
        return
      }

      onPlaceOrder({
        customerName: formState.name,
        items: cartItems,
        payment: formState.payment,
        total,
        shippingFee,
        subtotal,
      })
      setIsSubmitted(true)
      onClearCart()
    }

  if (isSubmitted) {
    return (
      <section className="page-panel checkout-page">
        <div className="checkout-success">
          <p className="panel-label">Order Complete</p>
          <h1>주문이 접수되었습니다.</h1>
          <span>{formState.name || '고객'} 님의 주문을 준비 중입니다.</span>
          <div className="detail-actions">
            <Link className="filled-button" to="/">
              홈으로 이동
            </Link>
            <Link className="ghost-dark-button" to="/products">
              다른 상품 보기
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    return (
      <section className="page-panel checkout-page">
        <div className="empty-page">
          <h1>주문할 상품이 없습니다.</h1>
          <Link className="filled-button" to="/products">
            상품 보러 가기
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-panel checkout-page">
      <SectionHeader
        label="Checkout"
        title="배송 정보 입력"
        description="장바구니에서 넘어온 상품을 확인하고 기본적인 주문 흐름까지 이어지도록 구성했습니다."
      />

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>받는 분</span>
            <input
              name="name"
              onChange={handleChange}
              placeholder="홍길동"
              required
              type="text"
              value={formState.name}
            />
          </label>
          <label className="form-field">
            <span>연락처</span>
            <input
              name="phone"
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
              type="tel"
              value={formState.phone}
            />
          </label>
          <label className="form-field">
            <span>배송 주소</span>
            <input
              name="address"
              onChange={handleChange}
              placeholder="서울시 성동구..."
              required
              type="text"
              value={formState.address}
            />
          </label>
          <label className="form-field">
            <span>배송 메모</span>
            <textarea
              name="note"
              onChange={handleChange}
              placeholder="문 앞에 놓아주세요"
              rows="4"
              value={formState.note}
            />
          </label>

          <fieldset className="payment-fieldset">
            <legend>결제 수단</legend>
            <div className="payment-options">
              <label className={`payment-option ${formState.payment === 'card' ? 'active' : ''}`}>
                <input
                  checked={formState.payment === 'card'}
                  name="payment"
                  onChange={handleChange}
                  type="radio"
                  value="card"
                />
                <span>신용카드</span>
              </label>
              <label className={`payment-option ${formState.payment === 'bank' ? 'active' : ''}`}>
                <input
                  checked={formState.payment === 'bank'}
                  name="payment"
                  onChange={handleChange}
                  type="radio"
                  value="bank"
                />
                <span>무통장입금</span>
              </label>
              <label className={`payment-option ${formState.payment === 'phone' ? 'active' : ''}`}>
                <input
                  checked={formState.payment === 'phone'}
                  name="payment"
                  onChange={handleChange}
                  type="radio"
                  value="phone"
                />
                <span>휴대폰결제</span>
              </label>
            </div>
          </fieldset>

          <button className="filled-button full-width" type="submit">
            {formatPrice(total)} 결제하기
          </button>
        </form>

        <aside className="order-summary checkout-summary">
          <p className="panel-label">Order Items</p>
          <div className="checkout-lines">
            {cartItems.map((item) => (
              <article className="checkout-line" key={item.cartId}>
                <div>
                  <p className="detail-brand">{item.brand}</p>
                  <h3>{item.name}</h3>
                  <span>
                    {item.size} / 수량 {item.quantity}
                  </span>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>
          <div className="checkout-total">
            <div className="summary-line">
              <span>상품 금액</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>배송비</span>
              <strong>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</strong>
            </div>
            <div className="summary-line">
              <span>결제 수단</span>
              <strong>{getPaymentLabel(formState.payment)}</strong>
            </div>
            <span>총 상품 수 {totalQuantity}개</span>
            <h2>{formatPrice(total)}</h2>
          </div>
        </aside>
      </div>
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

function OrdersPage({ orders }) {
  return (
    <section className="page-panel orders-page">
      <SectionHeader
        label="Orders"
        title="주문 내역"
        description="체크아웃 완료 시 로컬에 저장된 주문 내역을 다시 확인할 수 있도록 연결했습니다."
      />

      {orders.length === 0 ? (
        <div className="empty-page">
          <h1>아직 주문 내역이 없습니다.</h1>
          <Link className="filled-button" to="/products">
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-head">
                <div>
                  <p className="detail-brand">ORDER #{order.id}</p>
                  <h3>{order.customerName} 님 주문</h3>
                </div>
                <div className="order-head-meta">
                  <span>{formatOrderDate(order.createdAt)}</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
              </div>

              <div className="order-summary-grid">
                <div className="summary-line">
                  <span>상품 금액</span>
                  <strong>{formatPrice(order.subtotal)}</strong>
                </div>
                <div className="summary-line">
                  <span>배송비</span>
                  <strong>{order.shippingFee === 0 ? '무료' : formatPrice(order.shippingFee)}</strong>
                </div>
                <div className="summary-line">
                  <span>결제 수단</span>
                  <strong>{getPaymentLabel(order.payment)}</strong>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <article className="order-item" key={`${order.id}-${item.cartId}`}>
                    <div className={`cart-preview ${item.tone}`} />
                    <div>
                      <p className="detail-brand">{item.brand}</p>
                      <h3>{item.name}</h3>
                      <span>
                        {item.size} / 수량 {item.quantity}
                      </span>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default function App() {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [likedIds, setLikedIds] = useState(() => readStorage(WISHLIST_STORAGE_KEY, []))
  const [orders, setOrders] = useState(() => readStorage(ORDER_STORAGE_KEY, []))

  function handleAddToCart(product, size) {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id && item.size === size)

      if (existingItem) {
        return prev.map((item) =>
          item.cartId === existingItem.cartId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...prev,
        {
          cartId: `${product.id}-${size}`,
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: 1,
          size,
          tone: product.tone,
        },
      ]
    })
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

  function handleClearCart() {
    setCartItems([])
  }

  function handlePlaceOrder(order) {
    setOrders((prev) => [
      {
        ...order,
        createdAt: new Date().toISOString(),
        id: String(Date.now()).slice(-6),
      },
      ...prev,
    ])
  }

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(likedIds))
  }, [likedIds])

  useEffect(() => {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  return (
    <BrowserRouter>
      <Layout cartCount={cartItems.length} orderCount={orders.length} wishlistCount={likedIds.length}>
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
          <Route
            element={
              <CheckoutPage
                cartItems={cartItems}
                onClearCart={handleClearCart}
                onPlaceOrder={handlePlaceOrder}
              />
            }
            path="/checkout"
          />
          <Route element={<OrdersPage orders={orders} />} path="/orders" />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
