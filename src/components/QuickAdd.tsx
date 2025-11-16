import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { PokemonTCGAPI } from '@/api/pokemonTCG';
import type { PokemonTCGCard, Card } from '@/types';
import './QuickAdd.css';

interface QuickAddProps {
  onClose?: () => void;
}

export default function QuickAdd({ onClose }: QuickAddProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonTCGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PokemonTCGCard | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Near Mint');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await PokemonTCGAPI.searchCards(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching cards:', error);
      alert('Error searching cards. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!selectedCard) return;

    try {
      const card: Card = {
        name: selectedCard.name,
        set_id: selectedCard.set.id,
        set_name: selectedCard.set.name,
        number: selectedCard.number,
        rarity: selectedCard.rarity,
        type: selectedCard.types?.[0],
        supertype: selectedCard.supertype,
        subtype: selectedCard.subtypes?.[0],
        hp: selectedCard.hp ? parseInt(selectedCard.hp) : undefined,
        image_url: selectedCard.images.large,
        small_image_url: selectedCard.images.small,
        large_image_url: selectedCard.images.large,
        tcgplayer_id: selectedCard.tcgplayer?.url,
        condition,
        quantity,
      };

      await invoke('add_card', { card });
      alert('Card added successfully!');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Error adding card. Please try again.');
    }
  };

  return (
    <div className="quick-add">
      <div className="quick-add-header">
        <h2>Quick Add Card</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            className="glass-input"
            placeholder="Search for a card (e.g., Charizard, Pikachu VMAX)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="glass-button primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          <div className="results-grid">
            {searchResults.map((card) => (
              <div
                key={card.id}
                className={`result-card glass-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                onClick={() => setSelectedCard(card)}
              >
                {card.images.small && (
                  <img src={card.images.small} alt={card.name} className="result-image" />
                )}
                <div className="result-info">
                  <h4>{card.name}</h4>
                  <p>{card.set.name}</p>
                  {card.number && <span>#{card.number}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCard && (
        <div className="card-details glass-panel">
          <h3>Card Details</h3>
          <div className="details-content">
            <div className="detail-row">
              <label>Quantity:</label>
              <input
                type="number"
                className="glass-input"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="detail-row">
              <label>Condition:</label>
              <select
                className="glass-input"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option>Near Mint</option>
                <option>Lightly Played</option>
                <option>Moderately Played</option>
                <option>Heavily Played</option>
                <option>Damaged</option>
              </select>
            </div>
            <button className="glass-button primary" onClick={handleAddCard}>
              Add to Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

