
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
  let quit:CustomMenuItem = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide:CustomMenuItem = CustomMenuItem::new("hide".to_string(), "Hide");
  let tray_menu:SystemTrayMenu = SystemTrayMenu::new()
    .add_item(quit)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(hide);
  let tray:SystemTray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .system_tray(tray)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
