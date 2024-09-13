use std::process::Command;
use tokio::process::Command as AsyncCommand;
use url::Url;
use serde_json::json;
use dirs;


// fetch 
pub async fn fetch_video(url: &str) -> Result<String, String> {
    println!("Attempting to fetch video info from URL: {}", url);
    
    let output = Command::new("yt-dlp")
        .arg("--dump-json")
        .arg(url)
        .output()
        .map_err(|e| format!("Error executing yt-dlp: {}", e))?;

    if output.status.success() {
        let json_output = String::from_utf8_lossy(&output.stdout);
        let video_info: serde_json::Value = serde_json::from_str(&json_output)
            .map_err(|e| format!("Error parsing JSON output: {}", e))?;

        // Debug: Print the raw JSON output
        //println!("Raw JSON output: {}", json_output);

        // Try to get filesize from different possible fields
        let filesize_bytes = video_info["filesize"]
            .as_f64()
            .or_else(|| video_info["filesize_approx"].as_f64())
            .or_else(|| {
                // If filesize is not available, try to calculate from bitrate and duration
                let bitrate = video_info["tbr"].as_f64()?;
                let duration = video_info["duration"].as_f64()?;
                Some(bitrate * duration / 8.0)
            })
            .unwrap_or(0.0);

        let filesize_mb = (filesize_bytes / (1024.0 * 1024.0)).round();

        let video_info = json!({
            "title": video_info["title"],
            "author": video_info["uploader"],
            "description": video_info["description"],
            "view_count": video_info["view_count"],
            "length_seconds": video_info["duration"],
            "thumbnail_url": video_info["thumbnail"],
            "video_id": video_info["id"],
            "channel_id": video_info["channel_id"],
            "filesize_mb": filesize_mb,
        });

        println!("Successfully retrieved video information");
        println!("Filesize: {} MB", filesize_mb);
        Ok(serde_json::to_string(&video_info).unwrap())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Error fetching video information: {}", error))
    }
}
// download video
pub async fn download_video(url: &str) -> Result<String, String> {
    println!("Attempting to download video from URL: {}", url);

    let parsed_url = Url::parse(url).map_err(|e| format!("Invalid URL: {}", e))?;
    
    let download_dir = dirs::download_dir()
        .ok_or_else(|| "Could not find download directory".to_string())?;

    let output_template = download_dir.join("%(title)s.%(ext)s");

    let output = AsyncCommand::new("yt-dlp")
        .arg(parsed_url.as_str())
        .arg("-o")
        .arg(output_template.to_str().unwrap())
        .output()
        .await
        .map_err(|e| format!("Error executing yt-dlp: {}", e))?;

    if output.status.success() {
        Ok(format!("Video successfully downloaded to {}", download_dir.display()))
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Error downloading video: {}", error))
    }
}
// download audio
pub async fn download_audio(url: &str) -> Result<String, String> {
    println!("Attempting to download audio from URL: {}", url);

    let parsed_url = Url::parse(url).map_err(|e| format!("Invalid URL: {}", e))?;
    
    let download_dir = dirs::download_dir()
        .ok_or_else(|| "Could not find download directory".to_string())?;

    let output_template = download_dir.join("%(title)s.%(ext)s");

    let output = AsyncCommand::new("yt-dlp")
        .arg(parsed_url.as_str())
        .arg("-x")  // Extract audio only
        .arg("--audio-format")
        .arg("mp3")  // Convert to MP3
        .arg("-o")
        .arg(output_template.to_str().unwrap())
        .output()
        .await
        .map_err(|e| format!("Error executing yt-dlp: {}", e))?;

    if output.status.success() {
        Ok(format!("Audio successfully downloaded to {}", download_dir.display()))
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Error downloading audio: {}", error))
    }
}

// log js > rust
pub fn log_to_console(message: &str, level: &str) {
    match level {
        "log" => println!("JS Log: {}", message),
        "error" => eprintln!("JS Error: {}", message),
        "warn" => println!("JS Warning: {}", message),
        "info" => println!("JS Info: {}", message),
        _ => println!("JS: {}", message),
    }
}