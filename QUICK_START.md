# PokeMaster Quick Start 🚀

## ⚡ 5-Minute Setup

### 1. Install Prerequisites

**Windows:**
```powershell
# Install Node.js from nodejs.org
# Install Rust: https://rustup.rs/
# Install Visual C++ Build Tools
```

**macOS:**
```bash
xcode-select --install
# Install Node.js and Rust
```

**Linux:**
```bash
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev
# Install Node.js and Rust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get API Key

1. Go to [pokemontcg.io](https://pokemontcg.io/)
2. Sign up (free)
3. Copy your API key

### 4. Configure

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your API key:
# VITE_POKEMON_TCG_API_KEY=your_key_here
```

### 5. Run!

```bash
npm run tauri:dev
```

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - System architecture and design decisions
- **ROADMAP.md** - Implementation roadmap
- **IMPLEMENTATION_GUIDE.md** - Development guide

## 🎯 First Steps

1. **Run the app** - `npm run tauri:dev`
2. **Add your first card** - Click "Quick Add" → Search → Add
3. **Explore the UI** - Navigate through different views
4. **Read the code** - Check out `src/components/` for UI components

## 🛠️ Common Commands

```bash
npm run tauri:dev      # Run in development
npm run tauri:build    # Build for production
npm run dev            # Frontend only (no Tauri)
```

## 🐛 Troubleshooting

**Rust not found?** → Install from rustup.rs
**Database errors?** → Check app data directory permissions
**API errors?** → Verify API key in `.env`
**Port in use?** → Change port in `vite.config.ts`

See **SETUP.md** for detailed troubleshooting.

## 📖 Project Structure

```
src/              → React frontend
src-tauri/        → Rust backend
ARCHITECTURE.md   → Design docs
ROADMAP.md        → What's next
```

## 🎨 Features

- ✅ Beautiful glassmorphism UI
- ✅ Quick card search and add
- ✅ Local SQLite database
- ✅ Card inventory management
- 🚧 Price tracking (coming soon)
- 🚧 Wish list (coming soon)

## 💡 Tips

- First run compiles Rust (takes a few minutes)
- API key is required for card search
- Database auto-creates on first use
- Check terminal for backend logs
- Press F12 for frontend DevTools

---

**Ready to build?** Check out **IMPLEMENTATION_GUIDE.md** for next steps! 🎴

