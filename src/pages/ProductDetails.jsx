
import { useState } from 'react'
import './ProductDetails.css'

function ProductDetails({ product, onAddToCart, onBack }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  return (
    <div className="details-page">
      <button className="details-back" onClick={onBack}>
        ← Back to Shopping
      </button>

      <div className="details-container">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
          <span>{product.tag}</span>
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="details-rating">
            ★ {product.rating} <span>Customer rating</span>
          </p>

          <div className="details-price">
            <strong>₹{product.price.toLocaleString('en-IN')}</strong>
            <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>
            <span>
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}% OFF
            </span>
          </div>

          <p className="details-description">
            Discover quality, comfort and style with {product.name}.
            A perfect addition to your everyday collection.
            Shop with confidence at ShopSphere.
          </p>

          <div className="details-quantity">
            <span>Quantity</span>

            <div>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <strong>{quantity}</strong>

              <button onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <button
            className="details-add-button"
            onClick={() => onAddToCart(product, quantity)}
          >
            Add to Cart
          </button>

          <p className="delivery-note">
            ✓ Secure shopping experience
            <br />
            ✓ Free delivery on orders above ₹999
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
