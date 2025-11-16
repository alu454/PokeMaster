# PokeMaster Architecture Documentation

## 🏗️ Architecture Overview

PokeMaster is a desktop-first Pokémon card inventory application built with a modern, modular architecture that supports real-time price tracking, card management, and future hardware integration.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  React + TypeScript + Glassmorphism UI Components       │
│  - Card Inventory View                                  │
│  - Quick Add/Scan Interface                             │
│  - Price Tracking Dashboard                             │
│  - Wish List Management                                 │
│  - Settings & Configuration                             │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  Tauri Commands (Rust)                                  │
│  - Database Operations                                  │
│  - API Integration                                      │
│  - File System Access                                   │
│  - Future: Serial/USB Communication                     │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  SQLite Database                                        │
│  - Cards Table                                          │
│  - Sets Table                                           │
│  - Prices Table (with history)                          │
│  - Tags Table                                           │
│  - Wish List Table                                      │
│  JSON Cache Layer (for API responses)                   │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  - Pokémon TCG API (card data)                          │
│  - TCGPlayer API (prices)                               │
│  - CardMarket API (optional, prices)                    │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack Recommendation

### **Primary Stack: Tauri + React + TypeScript**

**Why Tauri over Electron?**
- ✅ **Smaller bundle size** (~3-5MB vs ~100MB+ for Electron)
- ✅ **Better performance** (native Rust backend)
- ✅ **Lower memory footprint**
- ✅ **Native security** (no Node.js in renderer)
- ✅ **Future-proof** for servo integration (Rust native)
- ✅ **Cross-platform** (Windows, macOS, Linux)

**Why React?**
- ✅ Modern, component-based architecture
- ✅ Large ecosystem and community
- ✅ Easy to implement glassmorphism with CSS-in-JS or CSS modules
- ✅ Great state management options (Zustand, Redux, etc.)
- ✅ Excellent TypeScript support

**Why TypeScript?**
- ✅ Type safety for card data models
- ✅ Better IDE support and autocomplete
- ✅ Easier refactoring and maintenance

### **Supporting Technologies**

- **Database**: SQLite (via `sqlx` in Rust, `better-sqlite3` or Tauri commands)
- **State Management**: Zustand (lightweight, simple)
- **Styling**: CSS Modules + CSS Variables (for glassmorphism)
- **API Client**: Axios or Fetch API
- **Build Tool**: Vite (fast, modern)
- **UI Components**: Custom glassmorphism components

### **Alternative Consideration: PySide6**

If you prefer Python:
- ✅ You already know Python
- ✅ Qt is mature and powerful
- ❌ Larger bundle size
- ❌ Less modern web ecosystem
- ❌ Harder to implement glassmorphism (though possible)

**Recommendation**: Start with Tauri + React for modern development experience, but the architecture is modular enough to port later if needed.

## 📊 Database Schema

### Core Tables

#### `cards`
```sql
CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    set_id TEXT NOT NULL,
    set_name TEXT NOT NULL,
    number TEXT,
    rarity TEXT,
    type TEXT,
    supertype TEXT,
    subtype TEXT,
    hp INTEGER,
    image_url TEXT,
    small_image_url TEXT,
    large_image_url TEXT,
    tcgplayer_id TEXT,
    cardmarket_id TEXT,
    condition TEXT DEFAULT 'Near Mint',
    grade TEXT,
    quantity INTEGER DEFAULT 1,
    notes TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (set_id) REFERENCES sets(id)
);

CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_set_id ON cards(set_id);
CREATE INDEX idx_cards_tcgplayer_id ON cards(tcgplayer_id);
```

#### `sets`
```sql
CREATE TABLE sets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    series TEXT,
    printed_total INTEGER,
    total INTEGER,
    release_date TEXT,
    symbol_url TEXT,
    logo_url TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `prices`
```sql
CREATE TABLE prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    source TEXT NOT NULL, -- 'tcgplayer', 'cardmarket', etc.
    low_price REAL,
    mid_price REAL,
    high_price REAL,
    market_price REAL,
    direct_low_price REAL,
    trend_price REAL,
    currency TEXT DEFAULT 'USD',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE INDEX idx_prices_card_id ON prices(card_id);
CREATE INDEX idx_prices_last_updated ON prices(last_updated);
```

#### `price_history`
```sql
CREATE TABLE price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    price_type TEXT NOT NULL, -- 'low', 'mid', 'high', 'market'
    price REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE INDEX idx_price_history_card_id ON price_history(card_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at);
```

#### `tags`
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT, -- Hex color for UI display
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `card_tags`
```sql
CREATE TABLE card_tags (
    card_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (card_id, tag_id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

#### `wishlist`
```sql
CREATE TABLE wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_name TEXT NOT NULL,
    set_id TEXT,
    set_name TEXT,
    priority INTEGER DEFAULT 5, -- 1-10 scale
    max_price REAL,
    notes TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (set_id) REFERENCES sets(id)
);
```

## 🔌 API Integration Plan

### 1. Pokémon TCG API (pokemontcg.io)
**Purpose**: Card data, images, set information
**Endpoint**: `https://api.pokemontcg.io/v2/`
**Rate Limit**: Free tier: 100 requests/day
**Authentication**: API key (free registration)

**Key Endpoints**:
- `GET /cards?q=name:charizard` - Search cards
- `GET /cards/{id}` - Get specific card
- `GET /sets` - List all sets
- `GET /sets/{id}` - Get specific set

**Implementation**:
- Cache responses locally (JSON files)
- Batch requests when possible
- Handle rate limiting gracefully

### 2. TCGPlayer API
**Purpose**: Real-time market prices
**Endpoint**: `https://api.tcgplayer.com/`
**Rate Limit**: Varies by tier
**Authentication**: OAuth 2.0

**Key Endpoints**:
- `GET /pricing/product/{productId}` - Get prices for a product
- `GET /catalog/products` - Search products

**Implementation**:
- Store API credentials securely
- Cache prices with timestamps
- Background sync every 1-6 hours (configurable)

### 3. CardMarket API (Optional)
**Purpose**: European market prices
**Endpoint**: `https://www.cardmarket.com/en/Pokemon/Products/Singles`
**Note**: May require web scraping or unofficial API

## 🎨 UI Wireframe Descriptions

### Main Layout (Glassmorphism Design)

```
┌─────────────────────────────────────────────────────────────┐
│  Header Bar (Frosted Glass)                                 │
│  [Logo] PokeMaster  [Search Bar]  [Settings] [Sync Status] │
└─────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                   │
│ Sidebar  │              Main Content Area                    │
│ (Glass)  │              (Frosted Glass Panels)               │
│          │                                                   │
│ [Home]   │  ┌──────────────────────────────────────────┐   │
│ [Cards]  │  │  Card Grid / List View                   │   │
│ [Sets]   │  │  (Glass Cards with Images)                │   │
│ [Prices] │  │                                          │   │
│ [Wish]   │  │  [Card] [Card] [Card] [Card]            │   │
│ [Tags]   │  │  [Card] [Card] [Card] [Card]            │   │
│          │  └──────────────────────────────────────────┘   │
│          │                                                   │
│          │  ┌──────────────────────────────────────────┐   │
│          │  │  Quick Add Panel (Glass)                 │   │
│          │  │  [Search] [Scan] [Manual Entry]          │   │
│          │  └──────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────┘
```

### Key UI Components

1. **Glass Card Component**
   - Frosted glass background (backdrop-filter: blur)
   - Subtle border (1px, rgba)
   - Card image with overlay
   - Price badge (floating)
   - Tag chips
   - Hover effects (slight scale, glow)

2. **Search Bar**
   - Glass input field
   - Auto-complete dropdown
   - Filter chips

3. **Price Display**
   - Trend indicators (↑↓)
   - Color-coded (green/red)
   - Historical chart (mini sparkline)

4. **Quick Add Modal**
   - Full-screen overlay (frosted)
   - Search interface
   - Image upload/scan area
   - Auto-fill form

## 🔄 Real-time Price Updates

### Strategy

1. **Background Worker** (Tauri Rust backend)
   - Runs on app startup
   - Checks last update time for each card
   - Queues cards needing updates
   - Respects API rate limits
   - Updates database incrementally

2. **Update Frequency**
   - High-value cards: Every 1 hour
   - Medium-value cards: Every 6 hours
   - Low-value cards: Every 24 hours
   - Manual refresh: On-demand

3. **Offline Mode**
   - Use cached prices
   - Queue updates when offline
   - Sync when connection restored

4. **Price History**
   - Store daily snapshots
   - Enable trend analysis
   - Show charts over time

## 📱 Future Scaling Considerations

### Mobile Client
- Share database schema
- REST API layer (optional)
- Sync via cloud storage or API
- React Native or Flutter

### Physical Sorting System
- Tauri command for serial communication
- Protocol: JSON over serial/USB
- Commands: `{action: "sort", card_id: 123, slot: 5}`
- Modular design allows easy integration

### Cloud Sync (Optional)
- Encrypted database sync
- Multi-device support
- Backup and restore

## 🚀 Implementation Roadmap

See `ROADMAP.md` for detailed step-by-step implementation plan.

