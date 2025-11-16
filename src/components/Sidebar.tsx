import './Sidebar.css';

interface SidebarProps {
  activeView: 'inventory' | 'add' | 'prices' | 'wishlist' | 'tags';
  onViewChange: (view: 'inventory' | 'add' | 'prices' | 'wishlist' | 'tags') => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'inventory' as const, label: 'Inventory', icon: '📦' },
    { id: 'add' as const, label: 'Quick Add', icon: '➕' },
    { id: 'prices' as const, label: 'Prices', icon: '💰' },
    { id: 'wishlist' as const, label: 'Wish List', icon: '⭐' },
    { id: 'tags' as const, label: 'Tags', icon: '🏷️' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h1 className="sidebar-title text-glow">PokeMaster</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

