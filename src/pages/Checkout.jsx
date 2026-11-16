
import { useState } from 'react'
import './Checkout.css'

function Checkout({ cartItems, onBack, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    payment: 'Cash on Delivery',
  })

  const [orderId, setOrderId] = useState('')

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49
  const total = subtotal + delivery

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (cartItems.length === 0) return

    const newOrderId = `SS${Date.now().toString().slice(-8)}`
    setOrderId(newOrderId)
    onPlaceOrder()
  }

  if (orderId) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <span className="checkout-eyebrow">ORDER CONFIRMED</span>
          <h1>Thank you for your order!</h1>
          <p>Your order has been placed successfully.</p>

          <div className="order-id-box">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>

          <p className="payment-confirmation">
            Payment method: {form.payment}
          </p>

          <h2>Order Total: ₹{total.toLocaleString('en-IN')}</h2>

          <button
            className="checkout-submit"
            onClick={onBack}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <button className="checkout-back" onClick={onBack}>
        ← Back to Cart
      </button>

      <div className="checkout-heading">
        <span className="checkout-eyebrow">ALMOST YOURS</span>
        <h1>Checkout</h1>
        <p>Enter your details to complete your order.</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-layout">
        <div className="checkout-form">
          <section className="checkout-section">
            <h2>Customer Information</h2>

            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </label>
          </section>

          <section className="checkout-section">
            <h2>Shipping Address</h2>

            <label>
              House / Street Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="3"
                required
              />
            </label>

            <div className="checkout-two-columns">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </label>

              <label>
                Pincode
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={form.payment === 'Cash on Delivery'}
                onChange={handleChange}
              />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives.</small>
              </span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Online Payment (Demo)"
                checked={form.payment === 'Online Payment (Demo)'}
                onChange={handleChange}
              />
              <span>
                <strong>Online Payment</strong>
                <small>Demo selection only. No payment will be processed.</small>
              </span>
            </label>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div>
                <strong>{item.name}</strong>
                <small>Quantity: {item.quantity}</small>
              </div>

              <strong>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </strong>
            </div>
          ))}

          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
          </div>

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>

          <button
            type="submit"
            className="checkout-submit"
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>

          <p className="checkout-note">
            Your order details will be confirmed on this page.
          </p>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
