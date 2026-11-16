
import './Cart.css'

function Cart({ cartItems, setCartItems, onContinueShopping, onCheckout }) {
  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49
  const total = subtotal + delivery

  return (
    <div className="cart-page">
      <button className="back-button" onClick={onContinueShopping}>
        ← Continue Shopping
      </button>

      <h1>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button onClick={onContinueShopping}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString('en-IN')}</p>

                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div>
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
            </div>

            <hr />

            <div className="total-row">
              <strong>Total</strong>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>

            <button
              className="checkout-button"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
