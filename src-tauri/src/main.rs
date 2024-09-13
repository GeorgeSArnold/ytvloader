
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// import
use ytvloader::{ fetch_video, download_video, download_audio, log_to_console};


use tauri::Manager;

// fetch
#[tauri::command]
async fn fetch(url: String) -> Result<String, String> {
    fetch_video(&url).await
}
// video
#[tauri::command]
async fn download(url: String) -> Result<String, String> {
    download_video(&url).await
}
// audio 
#[tauri::command]
async fn download_audio_only(url: String) -> Result<String, String> {
    download_audio(&url).await
}
// debug js console.log() > rust println!()
#[tauri::command]
fn rust_console(message: String, level: String) {
    log_to_console(&message, &level);
}


#[tauri::command]
async fn refresh_webview(window: tauri::Window) {
    if let Err(e) = window.eval("window.location.reload()") {
        eprintln!("Error refreshing webview: {}", e);
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            fetch,
            download,
            download_audio_only,
            rust_console,
            refresh_webview,
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
