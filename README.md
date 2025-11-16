# PokeMaster 🎴

A beautiful, desktop-first Pokémon card inventory application with real-time price tracking, built with Tauri + React + TypeScript.

![Glassmorphism Design](https://img.shields.io/badge/Design-Glassmorphism-purple)
![Tauri](https://img.shields.io/badge/Framework-Tauri-FFC131)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)

## ✨ Features

- **Fast Card Addition** - Quick search and add cards from the Pokémon TCG API
- **Real-time Price Tracking** - Track market prices from TCGPlayer and other sources
- **Beautiful Glassmorphism UI** - Modern, frosted glass design with vibrant gradients
- **Organized Collection** - Tags, filters, and sorting options
- **Wish List** - Track cards you want with price alerts
- **Offline Support** - Works offline with local SQLite database
- **Future-Ready** - Modular architecture for physical sorting hardware integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** (latest stable) - [Install Rust](https://www.rust-lang.org/tools/install)
- **System Dependencies**:
  - **Windows**: Microsoft Visual C++ Build Tools
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PokeMaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Pokémon TCG API key:
   ```
   VITE_POKEMON_TCG_API_KEY=your_api_key_here
   ```
   
   Get your free API key from [pokemontcg.io](https://pokemontcg.io/)

4. **Run in development mode**
   ```bash
   npm run tauri:dev
   ```

5. **Build for production**
   ```bash
   npm run tauri:build
   ```

## 📁 Project Structure

```
PokeMaster/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── api/               # API clients
│   ├── types/             # TypeScript types
│   └── styles/            # CSS styles (glassmorphism)
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Tauri entry point
│   │   ├── commands.rs    # Tauri commands (API)
│   │   └── database.rs    # Database setup
│   └── Cargo.toml         # Rust dependencies
├── ARCHITECTURE.md        # Detailed architecture docs
└── ROADMAP.md            # Implementation roadmap
```

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Tauri (Rust)
- **Database**: SQLite (via sqlx)
- **Styling**: CSS Modules + Glassmorphism design system
- **State Management**: Zustand (lightweight)
- **API**: Pokémon TCG API, TCGPlayer API

### Key Design Decisions

1. **Tauri over Electron**: Smaller bundle size (~5MB vs ~100MB), better performance, native Rust backend
2. **SQLite**: Perfect for local-first desktop app, no server required
3. **Glassmorphism UI**: Modern, beautiful design that stands out
4. **Modular Architecture**: Easy to add features like physical sorting hardware

## 📊 Database Schema

The app uses SQLite with the following main tables:

- `cards` - Card inventory
- `sets` - Pokémon TCG sets
- `prices` - Current market prices
- `price_history` - Historical price data
- `tags` - Custom tags
- `card_tags` - Card-tag relationships
- `wishlist` - Wish list items

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full schema details.

## 🎨 UI Design

The app features a beautiful glassmorphism design with:

- Frosted glass effects with backdrop blur
- Vibrant gradient backgrounds
- Subtle light borders and transparency
- Smooth animations and transitions
- Responsive layout

## 🔌 API Integration

### Pokémon TCG API

Used for card data and images. Free tier includes 100 requests/day.

### TCGPlayer API

Used for real-time market prices. Requires API credentials.

## 🛣️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for the detailed implementation roadmap.

### Current Status: Phase 1-2 (Foundation & UI)

- ✅ Project setup
- ✅ Database schema
- ✅ Basic UI with glassmorphism
- ✅ Card CRUD operations
- ✅ Quick add with search
- 🚧 Price tracking (in progress)
- 🚧 Wish list (planned)
- 🚧 Image scanning (planned)
- 🚧 Physical sorting (future)

## 🧑‍💻 Development

### Available Scripts

- `npm run dev` - Run Vite dev server (frontend only)
- `npm run tauri:dev` - Run full Tauri app in dev mode
- `npm run build` - Build frontend
- `npm run tauri:build` - Build production app

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (recommended)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- [Pokémon TCG API](https://pokemontcg.io/) for card data
- [Tauri](https://tauri.app/) for the amazing framework
- Pokémon TCG for the amazing card game

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for Pokémon card collectors**
