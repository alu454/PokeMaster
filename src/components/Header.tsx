import { useState } from 'react';
import './Header.css';

interface HeaderProps {
  onQuickAdd: () => void;
}

export default function Header({ onQuickAdd }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header glass-panel">
      <div className="header-content">
        <div className="header-left">
          <input
            type="text"
            className="glass-input search-input"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-right">
          <button className="glass-button" onClick={onQuickAdd}>
            Quick Add
          </button>
          <div className="sync-status">
            <span className="status-dot"></span>
            <span>Synced</span>
          </div>
        </div>
      </div>
    </header>
  );
}

