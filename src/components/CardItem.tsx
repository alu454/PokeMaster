import { useState } from 'react';
import type { Card } from '@/types';
import './CardItem.css';

interface CardItemProps {
  card: Card;
  onUpdate: () => void;
}

export default function CardItem({ card, onUpdate }: CardItemProps) {
  const [imageError, setImageError] = useState(false);

  const displayPrice = card.tcgplayer_id ? 'N/A' : null; // Placeholder for price

  return (
    <div className="card-item glass-card">
      <div className="card-image-container">
        {card.small_image_url && !imageError ? (
          <img
            src={card.small_image_url}
            alt={card.name}
            className="card-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-image-placeholder">
            <span>🃏</span>
          </div>
        )}
        {card.quantity && card.quantity > 1 && (
          <div className="quantity-badge">{card.quantity}x</div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-name">{card.name}</h3>
        <p className="card-set">{card.set_name}</p>
        {card.number && (
          <p className="card-number">#{card.number}</p>
        )}
        {card.rarity && (
          <span className="rarity-badge">{card.rarity}</span>
        )}
        {displayPrice && (
          <div className="card-price">
            <span className="price-label">Market:</span>
            <span className="price-value">${displayPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
}

