use serde::{Deserialize, Serialize};
use sqlx::Row;
use crate::database::get_pool;

#[derive(Debug, Serialize, Deserialize)]
pub struct Card {
    pub id: Option<i64>,
    pub name: String,
    pub set_id: String,
    pub set_name: String,
    pub number: Option<String>,
    pub rarity: Option<String>,
    pub r#type: Option<String>,
    pub supertype: Option<String>,
    pub subtype: Option<String>,
    pub hp: Option<i32>,
    pub image_url: Option<String>,
    pub small_image_url: Option<String>,
    pub large_image_url: Option<String>,
    pub tcgplayer_id: Option<String>,
    pub cardmarket_id: Option<String>,
    pub condition: Option<String>,
    pub grade: Option<String>,
    pub quantity: Option<i32>,
    pub notes: Option<String>,
    pub date_added: Option<String>,
    pub date_updated: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Set {
    pub id: String,
    pub name: String,
    pub series: Option<String>,
    pub printed_total: Option<i32>,
    pub total: Option<i32>,
    pub release_date: Option<String>,
    pub symbol_url: Option<String>,
    pub logo_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Price {
    pub id: Option<i64>,
    pub card_id: i64,
    pub source: String,
    pub low_price: Option<f64>,
    pub mid_price: Option<f64>,
    pub high_price: Option<f64>,
    pub market_price: Option<f64>,
    pub direct_low_price: Option<f64>,
    pub trend_price: Option<f64>,
    pub currency: Option<String>,
    pub last_updated: Option<String>,
}

#[tauri::command]
pub async fn get_cards() -> Result<Vec<Card>, String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    let rows = sqlx::query("SELECT * FROM cards ORDER BY date_added DESC")
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    let cards: Vec<Card> = rows
        .iter()
        .map(|row| Card {
            id: row.get("id"),
            name: row.get("name"),
            set_id: row.get("set_id"),
            set_name: row.get("set_name"),
            number: row.get("number"),
            rarity: row.get("rarity"),
            r#type: row.get("type"),
            supertype: row.get("supertype"),
            subtype: row.get("subtype"),
            hp: row.get("hp"),
            image_url: row.get("image_url"),
            small_image_url: row.get("small_image_url"),
            large_image_url: row.get("large_image_url"),
            tcgplayer_id: row.get("tcgplayer_id"),
            cardmarket_id: row.get("cardmarket_id"),
            condition: row.get("condition"),
            grade: row.get("grade"),
            quantity: row.get("quantity"),
            notes: row.get("notes"),
            date_added: row.get("date_added"),
            date_updated: row.get("date_updated"),
        })
        .collect();

    Ok(cards)
}

#[tauri::command]
pub async fn add_card(card: Card) -> Result<i64, String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    let result = sqlx::query(
        r#"
        INSERT INTO cards (
            name, set_id, set_name, number, rarity, type, supertype, subtype,
            hp, image_url, small_image_url, large_image_url, tcgplayer_id,
            cardmarket_id, condition, grade, quantity, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&card.name)
    .bind(&card.set_id)
    .bind(&card.set_name)
    .bind(&card.number)
    .bind(&card.rarity)
    .bind(&card.r#type)
    .bind(&card.supertype)
    .bind(&card.subtype)
    .bind(&card.hp)
    .bind(&card.image_url)
    .bind(&card.small_image_url)
    .bind(&card.large_image_url)
    .bind(&card.tcgplayer_id)
    .bind(&card.cardmarket_id)
    .bind(&card.condition)
    .bind(&card.grade)
    .bind(&card.quantity.unwrap_or(1))
    .bind(&card.notes)
    .execute(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(result.last_insert_rowid())
}

#[tauri::command]
pub async fn update_card(id: i64, card: Card) -> Result<(), String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    sqlx::query(
        r#"
        UPDATE cards SET
            name = ?, set_id = ?, set_name = ?, number = ?, rarity = ?,
            type = ?, supertype = ?, subtype = ?, hp = ?, image_url = ?,
            small_image_url = ?, large_image_url = ?, tcgplayer_id = ?,
            cardmarket_id = ?, condition = ?, grade = ?, quantity = ?,
            notes = ?, date_updated = CURRENT_TIMESTAMP
        WHERE id = ?
        "#,
    )
    .bind(&card.name)
    .bind(&card.set_id)
    .bind(&card.set_name)
    .bind(&card.number)
    .bind(&card.rarity)
    .bind(&card.r#type)
    .bind(&card.supertype)
    .bind(&card.subtype)
    .bind(&card.hp)
    .bind(&card.image_url)
    .bind(&card.small_image_url)
    .bind(&card.large_image_url)
    .bind(&card.tcgplayer_id)
    .bind(&card.cardmarket_id)
    .bind(&card.condition)
    .bind(&card.grade)
    .bind(&card.quantity.unwrap_or(1))
    .bind(&card.notes)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn delete_card(id: i64) -> Result<(), String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    sqlx::query("DELETE FROM cards WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn search_cards(query: String) -> Result<Vec<Card>, String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    let search_pattern = format!("%{}%", query);
    let rows = sqlx::query("SELECT * FROM cards WHERE name LIKE ? OR set_name LIKE ? ORDER BY name")
        .bind(&search_pattern)
        .bind(&search_pattern)
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    let cards: Vec<Card> = rows
        .iter()
        .map(|row| Card {
            id: row.get("id"),
            name: row.get("name"),
            set_id: row.get("set_id"),
            set_name: row.get("set_name"),
            number: row.get("number"),
            rarity: row.get("rarity"),
            r#type: row.get("type"),
            supertype: row.get("supertype"),
            subtype: row.get("subtype"),
            hp: row.get("hp"),
            image_url: row.get("image_url"),
            small_image_url: row.get("small_image_url"),
            large_image_url: row.get("large_image_url"),
            tcgplayer_id: row.get("tcgplayer_id"),
            cardmarket_id: row.get("cardmarket_id"),
            condition: row.get("condition"),
            grade: row.get("grade"),
            quantity: row.get("quantity"),
            notes: row.get("notes"),
            date_added: row.get("date_added"),
            date_updated: row.get("date_updated"),
        })
        .collect();

    Ok(cards)
}

#[tauri::command]
pub async fn get_sets() -> Result<Vec<Set>, String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    let rows = sqlx::query("SELECT * FROM sets ORDER BY release_date DESC")
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    let sets: Vec<Set> = rows
        .iter()
        .map(|row| Set {
            id: row.get("id"),
            name: row.get("name"),
            series: row.get("series"),
            printed_total: row.get("printed_total"),
            total: row.get("total"),
            release_date: row.get("release_date"),
            symbol_url: row.get("symbol_url"),
            logo_url: row.get("logo_url"),
        })
        .collect();

    Ok(sets)
}

#[tauri::command]
pub async fn get_prices(card_id: i64) -> Result<Vec<Price>, String> {
    let pool = get_pool().await.map_err(|e| e.to_string())?;

    let rows = sqlx::query("SELECT * FROM prices WHERE card_id = ? ORDER BY last_updated DESC")
        .bind(card_id)
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    let prices: Vec<Price> = rows
        .iter()
        .map(|row| Price {
            id: row.get("id"),
            card_id: row.get("card_id"),
            source: row.get("source"),
            low_price: row.get("low_price"),
            mid_price: row.get("mid_price"),
            high_price: row.get("high_price"),
            market_price: row.get("market_price"),
            direct_low_price: row.get("direct_low_price"),
            trend_price: row.get("trend_price"),
            currency: row.get("currency"),
            last_updated: row.get("last_updated"),
        })
        .collect();

    Ok(prices)
}

#[tauri::command]
pub async fn sync_prices() -> Result<String, String> {
    // Placeholder for price syncing logic
    // This will be implemented with API calls
    Ok("Price sync not yet implemented".to_string())
}

