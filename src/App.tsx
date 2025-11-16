import { useState } from 'react';
import './styles/glassmorphism.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CardInventory from './components/CardInventory';
import QuickAdd from './components/QuickAdd';

function App() {
  const [activeView, setActiveView] = useState<'inventory' | 'add' | 'prices' | 'wishlist' | 'tags'>('inventory');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <div className="app-container">
      <div className="animated-bg" />
      <div className="app-content">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="main-area">
          <Header onQuickAdd={() => setShowQuickAdd(true)} />
          <div className="view-container">
            {activeView === 'inventory' && <CardInventory />}
            {activeView === 'add' && <QuickAdd />}
            {activeView === 'prices' && <div className="glass-panel p-4">Price Tracking - Coming Soon</div>}
            {activeView === 'wishlist' && <div className="glass-panel p-4">Wish List - Coming Soon</div>}
            {activeView === 'tags' && <div className="glass-panel p-4">Tags Management - Coming Soon</div>}
          </div>
        </div>
      </div>
      {showQuickAdd && (
        <div className="modal-overlay" onClick={() => setShowQuickAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <QuickAdd onClose={() => setShowQuickAdd(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

