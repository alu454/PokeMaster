// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;

fn main() {
    // Database will be initialized on first use via get_pool()
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_cards,
            commands::add_card,
            commands::update_card,
            commands::delete_card,
            commands::search_cards,
            commands::get_sets,
            commands::get_prices,
            commands::sync_prices,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

