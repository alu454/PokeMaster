use sqlx::{sqlite::SqlitePool, Pool, Sqlite};

pub async fn get_pool() -> Result<Pool<Sqlite>, sqlx::Error> {
    // Get app data directory
    let app_data = tauri::api::path::app_data_dir(&tauri::Config::default())
        .ok_or_else(|| sqlx::Error::Configuration("Could not get app data directory".into()))?;
    
    std::fs::create_dir_all(&app_data).map_err(|e| {
        sqlx::Error::Configuration(format!("Could not create app data directory: {}", e).into())
    })?;

    let db_path = app_data.join("pokemaster.db");
    let database_url = format!("sqlite:{}", db_path.display());

    let pool = SqlitePool::connect(&database_url).await?;
    create_schema(&pool).await?;
    Ok(pool)
}


pub async fn create_schema(pool: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS sets (
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

        CREATE TABLE IF NOT EXISTS cards (
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

        CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name);
        CREATE INDEX IF NOT EXISTS idx_cards_set_id ON cards(set_id);
        CREATE INDEX IF NOT EXISTS idx_cards_tcgplayer_id ON cards(tcgplayer_id);

        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id INTEGER NOT NULL,
            source TEXT NOT NULL,
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

        CREATE INDEX IF NOT EXISTS idx_prices_card_id ON prices(card_id);
        CREATE INDEX IF NOT EXISTS idx_prices_last_updated ON prices(last_updated);

        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id INTEGER NOT NULL,
            source TEXT NOT NULL,
            price_type TEXT NOT NULL,
            price REAL NOT NULL,
            recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_price_history_card_id ON price_history(card_id);
        CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            color TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS card_tags (
            card_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (card_id, tag_id),
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_name TEXT NOT NULL,
            set_id TEXT,
            set_name TEXT,
            priority INTEGER DEFAULT 5,
            max_price REAL,
            notes TEXT,
            date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (set_id) REFERENCES sets(id)
        );
        "#,
    )
    .execute(pool)
    .await?;

    Ok(())
}

