# PokeMaster Setup Guide

## 🚀 Getting Started

This guide will walk you through setting up PokeMaster on your development machine.

## Prerequisites

### 1. Node.js and npm

Install Node.js 18 or higher from [nodejs.org](https://nodejs.org/).

Verify installation:
```bash
node --version  # Should be v18.0.0 or higher
npm --version
```

### 2. Rust

Install Rust using rustup from [rustup.rs](https://rustup.rs/).

**Windows:**
```powershell
# Download and run rustup-init.exe from rustup.rs
# Or use PowerShell:
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify installation:
```bash
rustc --version
cargo --version
```

### 3. System Dependencies

#### Windows
- Install [Microsoft Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Or install Visual Studio with C++ development tools

#### macOS
```bash
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

## Installation Steps

### Step 1: Clone and Navigate

```bash
cd PokeMaster
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and TypeScript dependencies
- Tauri CLI tools
- Vite build tool

### Step 3: Get API Keys

#### Pokémon TCG API (Required)

1. Go to [pokemontcg.io](https://pokemontcg.io/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

#### TCGPlayer API (Optional, for price tracking)

1. Go to [developer.tcgplayer.com](https://developer.tcgplayer.com/)
2. Create a developer account
3. Create a new application
4. Copy your Public Key and Private Key

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required: Pokémon TCG API Key
VITE_POKEMON_TCG_API_KEY=your_api_key_here

# Optional: TCGPlayer API (for price tracking)
# VITE_TCGPLAYER_PUBLIC_KEY=your_public_key
# VITE_TCGPLAYER_PRIVATE_KEY=your_private_key
```

### Step 5: Run Development Server

```bash
npm run tauri:dev
```

This will:
1. Start the Vite dev server (frontend)
2. Compile the Rust backend
3. Launch the Tauri application window

**First run may take a few minutes** as Rust compiles dependencies.

## 🛠️ Development Workflow

### Running the App

```bash
# Full Tauri app (recommended)
npm run tauri:dev

# Frontend only (for UI development)
npm run dev
```

### Building for Production

```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/`:
- **Windows**: `.exe` installer in `bundle/msi/`
- **macOS**: `.app` bundle in `bundle/macos/`
- **Linux**: `.AppImage` or `.deb` in `bundle/`

### Project Structure

```
PokeMaster/
├── src/                      # Frontend (React + TypeScript)
│   ├── components/          # UI components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── CardInventory.tsx
│   │   └── QuickAdd.tsx
│   ├── api/                 # API clients
│   │   └── pokemonTCG.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── styles/              # CSS styles
│   │   └── glassmorphism.css
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
│
├── src-tauri/               # Backend (Rust)
│   ├── src/
│   │   ├── main.rs          # Tauri entry point
│   │   ├── commands.rs      # Tauri commands (API)
│   │   └── database.rs      # Database setup
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
│
├── ARCHITECTURE.md          # Architecture documentation
├── ROADMAP.md              # Implementation roadmap
└── README.md               # Project overview
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Rust not found
**Error**: `error: linker 'cc' not found`

**Solution**: Install build tools for your platform (see System Dependencies above)

#### 2. Database errors
**Error**: `Failed to initialize database`

**Solution**: 
- Check that the app has write permissions
- Database is created in app data directory automatically
- Windows: `%APPDATA%\com.pokemaster.app\`
- macOS: `~/Library/Application Support/com.pokemaster.app/`
- Linux: `~/.local/share/com.pokemaster.app/`

#### 3. API key errors
**Error**: `Error searching cards`

**Solution**:
- Verify your API key in `.env`
- Check that `VITE_POKEMON_TCG_API_KEY` is set correctly
- Restart the dev server after changing `.env`

#### 4. Port already in use
**Error**: `Port 1420 is already in use`

**Solution**:
- Change the port in `vite.config.ts`
- Or kill the process using port 1420

#### 5. Tauri build fails
**Error**: Various Rust compilation errors

**Solution**:
- Update Rust: `rustup update`
- Clean build: `cd src-tauri && cargo clean && cd ..`
- Rebuild: `npm run tauri:dev`

### Getting Help

1. Check the [Tauri documentation](https://tauri.app/)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
3. Check [ROADMAP.md](./ROADMAP.md) for implementation status
4. Open an issue on GitHub

## 📚 Next Steps

1. **Explore the UI**: Navigate through the different views
2. **Add your first card**: Use Quick Add to search and add a card
3. **Review the code**: Check out the component structure
4. **Read the docs**: Review ARCHITECTURE.md for design details
5. **Start building**: Follow ROADMAP.md for next features

## 🎯 Development Tips

1. **Hot Reload**: Changes to React components reload automatically
2. **Rust Changes**: Changes to Rust code require restarting `tauri:dev`
3. **Database**: Use a SQLite browser to inspect the database
4. **API Limits**: Be mindful of API rate limits during development
5. **Console**: Check browser DevTools (F12) for frontend logs
6. **Rust Logs**: Check terminal for backend logs

## 🔧 Recommended Tools

- **VS Code** with extensions:
  - Rust Analyzer
  - ESLint
  - Prettier
  - Tauri (official extension)
- **SQLite Browser**: For database inspection
- **Postman/Insomnia**: For API testing

---

Happy coding! 🚀

