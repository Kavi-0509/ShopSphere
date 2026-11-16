
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'

const API_URL = 'http://localhost:5000/api/products'

const categories = [
  { name: 'All', icon: '✦' },
  { name: 'Fashion', icon: '♧' },
  { name: 'Electronics', icon: '⌁' },
  { name: 'Accessories', icon: '◇' },
]

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showWishlist, setShowWishlist] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to fetch products')
      }

      const data = await response.json()

      const formattedProducts = data.map((product) => ({
        ...product,
        id: product._id,
        oldPrice: product.originalPrice,
        tag: product.tag || 'NEW',
      }))

      setProducts(formattedProducts)
    } catch (err) {
      console.error('Product fetching error:', err)
      setError('Unable to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Search, category and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' ||
        product.category === activeCategory

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      return matchesCategory && matchesSearch
    })

    if (sortBy === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'highToLow') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, activeCategory, search, sortBy])

  // Wishlist
  const toggleWishlist = (product) => {
    setWishlist((previous) =>
      previous.some((item) => item.id === product.id)
        ? previous.filter((item) => item.id !== product.id)
        : [...previous, product]
    )
  }

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId)

  const displayedProducts = showWishlist
    ? wishlist
    : filteredProducts

  // Clear filters
  const clearFilters = () => {
    setSearch('')
    setActiveCategory('All')
    setSortBy('default')
    setShowWishlist(false)
  }

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart((previous) => {
      const existingItem = previous.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...previous, { ...product, quantity }]
    })

    setSelectedProduct(null)
    setShowCart(true)
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Checkout
  if (showCheckout) {
    return (
      <Checkout
        cartItems={cart}
        onBack={() => {
          setShowCheckout(false)
          setShowCart(true)
        }}
        onPlaceOrder={() => {
          setCart([])
        }}
      />
    )
  }

  // Cart
  if (showCart) {
    return (
      <Cart
        cartItems={cart}
        setCartItems={setCart}
        onContinueShopping={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false)
          setShowCheckout(true)
        }}
      />
    )
  }

  // Product details
  if (selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onAddToCart={addToCart}
        onBack={() => setSelectedProduct(null)}
      />
    )
  }

  return (
    <div className="app">

      <div className="announcement">
        ✨ Welcome to ShopSphere — Discover your everyday favourites!
      </div>

      {/* Navbar */}
      <header className="navbar">
        <a
          href="#home"
          className="brand"
          onClick={() => setShowWishlist(false)}
        >
          Shop<span>Sphere</span>.
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#home" onClick={() => {
            setMenuOpen(false)
            setShowWishlist(false)
          }}>Home</a>

          <a href="#categories" onClick={() => {
            setMenuOpen(false)
            setShowWishlist(false)
          }}>Categories</a>

          <a href="#products" onClick={() => {
            setMenuOpen(false)
            setShowWishlist(false)
          }}>Shop</a>

          <a href="#footer" onClick={() => {
            setMenuOpen(false)
            setShowWishlist(false)
          }}>About</a>
        </nav>

        <div className="nav-actions">
          <label className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowWishlist(false)
              }}
            />
          </label>

          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            ♧ <span>Cart</span>
            <b>{cartCount}</b>
          </button>

          <button
            className="cart-button"
            onClick={() => {
              setShowWishlist(true)
              setMenuOpen(false)
              document.getElementById('products')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
          >
            ♡ <span>Wishlist</span>
            <b>{wishlist.length}</b>
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="eyebrow">THE NEW WAY TO SHOP</span>

            <h1>
              Find your style.
              <br />
              <span>Love your choice.</span>
            </h1>

            <p>
              Explore a world of exciting products, everyday essentials
              and special finds — all in one place.
            </p>

            <a href="#products" className="primary-button">
              Explore Collection <span>→</span>
            </a>

            <div className="hero-stats">
              <div>
                <strong>{products.length}</strong>
                <small>Products</small>
              </div>
              <div>
                <strong>10k+</strong>
                <small>Happy shoppers</small>
              </div>
              <div>
                <strong>4.9★</strong>
                <small>Customer rating</small>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
              alt="ShopSphere shopping collection"
            />

            <div className="floating-card">
              <span>✦</span>
              <div>
                <strong>Something special</strong>
                <small>Just for you</small>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE MORE</span>
              <h2>Shop by category</h2>
            </div>
            <p>Find exactly what you are looking for.</p>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.name}
                className={
                  activeCategory === category.name
                    ? 'category-card active'
                    : 'category-card'
                }
                onClick={() => {
                  setActiveCategory(category.name)
                  setShowWishlist(false)
                  document.getElementById('products')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <strong>{category.name}</strong>
                <span className="category-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        {/* Products and Wishlist */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {showWishlist ? 'YOUR SAVED ITEMS' : 'OUR COLLECTION'}
              </span>

              <h2>
                {showWishlist ? 'My Wishlist' : 'Featured products'}
              </h2>
            </div>

            <span className="product-count">
              {displayedProducts.length} products
            </span>
          </div>

          {!showWishlist && (
            <>
              <div className="filter-list">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={
                      activeCategory === category.name
                        ? 'filter active'
                        : 'filter'
                    }
                    onClick={() => setActiveCategory(category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="advanced-filters">
                <input
                  type="search"
                  placeholder="Search products by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products by price"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>

                <button
                  className="clear-filter-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </>
          )}

          <div className="product-grid">
            {loading ? (
              <div className="empty-state">
                <h3>Loading products...</h3>
                <p>Please wait while we fetch products from ShopSphere.</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchProducts}>Try Again</button>
              </div>
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => setSelectedProduct(product)}
                      style={{ cursor: 'pointer' }}
                    />

                    <span className="product-tag">
                      {product.tag}
                    </span>

                    <button
                      className={
                        isWishlisted(product.id)
                          ? 'wishlist active'
                          : 'wishlist'
                      }
                      onClick={() => toggleWishlist(product)}
                      aria-label={
                        isWishlisted(product.id)
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                    >
                      {isWishlisted(product.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3
                      onClick={() => setSelectedProduct(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.name}
                    </h3>

                    <div className="rating">
                      ★ {product.rating}
                    </div>

                    <div className="product-bottom">
                      <div className="price">
                        <strong>
                          ₹{product.price.toLocaleString('en-IN')}
                        </strong>

                        {product.oldPrice > product.price && (
                          <del>
                            ₹{product.oldPrice.toLocaleString('en-IN')}
                          </del>
                        )}
                      </div>

                      <button
                        className="add-button"
                        onClick={() => addToCart(product)}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>
                  {showWishlist
                    ? 'Your wishlist is empty'
                    : 'No products found'}
                </h3>

                <p>
                  {showWishlist
                    ? 'Tap the heart icon on a product to save it here.'
                    : 'Try searching for something else.'}
                </p>

                <button
                  onClick={() => {
                    setShowWishlist(false)
                    clearFilters()
                  }}
                >
                  {showWishlist ? 'Continue Shopping' : 'Clear Filters'}
                </button>
              </div>
            )}
          </div>

          {showWishlist && (
            <button
              className="clear-filter-button"
              style={{ marginTop: '25px' }}
              onClick={() => setShowWishlist(false)}
            >
              Continue Shopping
            </button>
          )}
        </section>

        {/* Promo */}
        <section className="promo-section">
          <div>
            <span className="eyebrow">A LITTLE SOMETHING FOR YOU</span>

            <h2>
              Good finds.
              <br />
              Better prices.
            </h2>

            <p>
              Discover your next favourite at ShopSphere.
            </p>

            <a href="#products" className="primary-button">
              Shop now →
            </a>
          </div>

          <div className="promo-decoration">S</div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer">
        <a href="#home" className="brand">
          Shop<span>Sphere</span>.
        </a>

        <p>Your world of shopping, all in one sphere.</p>

        <p className="copyright">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
