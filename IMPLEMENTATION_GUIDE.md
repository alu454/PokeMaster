# PokeMaster Implementation Guide

## 🎯 Quick Start Checklist

- [ ] Install prerequisites (Node.js, Rust, system dependencies)
- [ ] Clone repository and run `npm install`
- [ ] Get Pokémon TCG API key and add to `.env`
- [ ] Run `npm run tauri:dev` to start development
- [ ] Test adding your first card

## 📋 Implementation Phases

### Phase 1: Foundation ✅ (Complete)

**Status**: All foundation work is complete!

- ✅ Project structure with Tauri + React + TypeScript
- ✅ Database schema and SQLite setup
- ✅ Basic Tauri commands for CRUD operations
- ✅ TypeScript types matching Rust structs
- ✅ Glassmorphism design system

**What you can do now:**
- Run the app and see the UI
- Add cards via Quick Add (requires API key)
- View your card collection

### Phase 2: Core Features (Next Steps)

#### 2.1: Enhanced Card Management

**Tasks:**
1. **Card Detail View**
   - Create `CardDetail.tsx` component
   - Show full card information
   - Edit card details inline
   - Delete card with confirmation

2. **Card Filtering & Sorting**
   - Add filter sidebar component
   - Filter by set, rarity, type
   - Sort by name, date, price
   - Search functionality

3. **Bulk Operations**
   - Select multiple cards
   - Bulk edit (quantity, condition, tags)
   - Bulk delete

**Files to create:**
- `src/components/CardDetail.tsx`
- `src/components/FilterSidebar.tsx`
- `src/components/BulkActions.tsx`

#### 2.2: Tag System

**Tasks:**
1. **Tag Management**
   - Create tags table (already in schema)
   - Add tag creation UI
   - Tag color picker
   - Tag editing/deletion

2. **Card Tagging**
   - Add tags to cards
   - Remove tags from cards
   - Filter by tags
   - Tag badges on cards

**Tauri Commands to add:**
```rust
// In commands.rs
#[tauri::command]
pub async fn create_tag(name: String, color: Option<String>) -> Result<i64, String>

#[tauri::command]
pub async fn get_tags() -> Result<Vec<Tag>, String>

#[tauri::command]
pub async fn add_tag_to_card(card_id: i64, tag_id: i64) -> Result<(), String>

#[tauri::command]
pub async fn remove_tag_from_card(card_id: i64, tag_id: i64) -> Result<(), String>
```

#### 2.3: Price Tracking

**Tasks:**
1. **Price Display**
   - Show prices on card items
   - Price detail modal
   - Price trend indicators (↑↓)
   - Color-coded price changes

2. **Price Sync**
   - Background worker for price updates
   - Configurable update frequency
   - Manual refresh button
   - Sync status indicator

3. **Price History**
   - Store daily price snapshots
   - Price history chart (use a charting library)
   - Trend analysis

**API Integration:**
- Implement TCGPlayer API client
- Map Pokémon TCG API card IDs to TCGPlayer product IDs
- Handle rate limiting
- Cache prices locally

**Files to create:**
- `src/api/tcgplayer.ts`
- `src/components/PriceChart.tsx`
- `src-tauri/src/price_sync.rs` (background worker)

### Phase 3: Advanced Features

#### 3.1: Wish List

**Tasks:**
1. **Wish List UI**
   - Wish list view
   - Add cards to wish list
   - Priority levels (1-10)
   - Max price alerts

2. **Wish List Features**
   - Show current market prices
   - Availability tracking
   - Price drop notifications
   - Mark as acquired

#### 3.2: Image Scanning (Future)

**Research needed:**
- OCR solutions (Tesseract.js, Google Vision API)
- Image recognition APIs
- Camera integration in Tauri

**Implementation:**
- Image upload component
- OCR processing
- Match to Pokémon TCG API
- Manual confirmation

#### 3.3: Physical Sorting System (Future)

**Architecture:**
- Serial/USB communication module
- Command protocol (JSON)
- Safety features (timeouts, error handling)

**Tauri Command:**
```rust
#[tauri::command]
pub async fn send_sort_command(card_id: i64, slot: u8) -> Result<(), String>
```

## 🛠️ Development Tips

### Adding New Tauri Commands

1. **Define the command in Rust** (`src-tauri/src/commands.rs`):
```rust
#[tauri::command]
pub async fn my_command(param: String) -> Result<String, String> {
    // Implementation
    Ok("Success".to_string())
}
```

2. **Register in main.rs**:
```rust
.invoke_handler(tauri::generate_handler![
    // ... existing commands
    commands::my_command,
])
```

3. **Call from TypeScript**:
```typescript
import { invoke } from '@tauri-apps/api/tauri';

const result = await invoke<string>('my_command', { param: 'value' });
```

### Database Migrations

For schema changes, create migration files:
- `src-tauri/migrations/001_add_new_column.sql`
- Update `create_schema()` in `database.rs`

### Styling Guidelines

- Use CSS variables from `glassmorphism.css`
- Follow glassmorphism design principles
- Maintain consistent spacing and borders
- Test hover states and transitions

### API Rate Limiting

- Cache API responses locally (JSON files)
- Implement request queuing
- Show user-friendly error messages
- Add retry logic with exponential backoff

## 📦 Recommended Libraries

### Frontend
- **Chart.js** or **Recharts** - For price history charts
- **React Query** - For API state management (optional)
- **Zustand** - Already included for state management
- **React Hook Form** - For form handling (optional)

### Backend (Rust)
- **tokio-cron-scheduler** - For scheduled price updates
- **serde** - Already included for serialization
- **chrono** - Already included for date handling
- **serialport** - For future servo communication

## 🧪 Testing Strategy

### Unit Tests
- Test database operations
- Test API clients
- Test utility functions

### Integration Tests
- Test Tauri commands end-to-end
- Test UI components
- Test API integration

### Manual Testing Checklist
- [ ] Add card via Quick Add
- [ ] Edit card details
- [ ] Delete card
- [ ] Search cards
- [ ] Filter by set/rarity
- [ ] Add/remove tags
- [ ] View price history
- [ ] Sync prices
- [ ] Add to wish list

## 🚀 Deployment

### Building for Production

1. **Update version** in:
   - `package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`

2. **Build**:
```bash
npm run tauri:build
```

3. **Test the build**:
   - Install the built app
   - Test all features
   - Check database location
   - Verify API keys work

### Distribution

- **Windows**: MSI installer in `src-tauri/target/release/bundle/msi/`
- **macOS**: DMG in `src-tauri/target/release/bundle/dmg/`
- **Linux**: AppImage or DEB in `src-tauri/target/release/bundle/`

## 📝 Code Style

### TypeScript/React
- Use functional components with hooks
- Type everything (strict mode enabled)
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Rust
- Follow Rust naming conventions
- Use `Result` for error handling
- Add doc comments for public functions
- Keep functions focused and small

## 🐛 Debugging

### Frontend
- Use React DevTools
- Check browser console (F12)
- Use `console.log` strategically
- Check Network tab for API calls

### Backend
- Use `println!` or `eprintln!` for debugging
- Check terminal output
- Use `dbg!` macro for values
- Enable SQLx query logging

### Database
- Use SQLite browser to inspect database
- Check app data directory for `.db` file
- Verify schema matches code

---

**Remember**: Start small, test often, and iterate! 🚀

