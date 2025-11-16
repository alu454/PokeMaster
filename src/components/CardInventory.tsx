import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import type { Card } from '@/types';
import CardItem from './CardItem';
import './CardInventory.css';

export default function CardInventory() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const result = await invoke<Card[]>('get_cards');
      setCards(result);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-4">
        <div className="loading-spinner">Loading cards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <div className="empty-icon">📦</div>
        <h2>No cards yet</h2>
        <p>Start building your collection by adding your first card!</p>
      </div>
    );
  }

  return (
    <div className="card-inventory">
      <div className="inventory-header glass-panel">
        <h2>Your Collection</h2>
        <div className="inventory-stats">
          <span>{cards.length} cards</span>
        </div>
      </div>
      <div className="cards-grid">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onUpdate={loadCards} />
        ))}
      </div>
    </div>
  );
}

