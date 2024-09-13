const { invoke } = window.__TAURI__.tauri;

const { appWindow } = window.__TAURI__.window;

// fetch
let fetchInputEl;
let fetchMsgEl;
// downlaod
let downloadMsgEl;
let downloadAudioMsgEl;
// clear
// let clearButtonEl;
// progress
let fetchProgressEl;
let progressBarEl;

// titlebar
let titlebarEl;
let closeBtn;
let refreshBtn;

// titlebar items
// close
async function closeApp() {
  console.log("Closing app...");
  try {
    await appWindow.close();
  } catch (error) {
    console.error("Error closing app:", error);
  }
}
// reload 
async function refreshWebview() {
  try {
    await invoke('refresh_webview');
  } catch (error) {
    console.error('Fehler beim Neuladen des Webviews:', error);
  }
}

// JS > RUST debug 
function logToRustConsole(message, level = 'log') {
  invoke('rust_console', { message, level })
    .catch(error => console.error('Fehler beim Senden an Rust-Konsole:', error));
}
// override all JS debug > RUST
console.log = (...args) => {
  const message = args.join(' ');
  logToRustConsole(message, 'log');
};
console.error = (...args) => {
  const message = args.join(' ');
  logToRustConsole(message, 'error');
};

// check url
function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
}
// fetch > api
async function fetchVideo() {
  console.log("Fetch video function called");

  const inputUrl = fetchInputEl.value.trim();

  // Check if the input is empty
  if (!inputUrl) {
    fetchMsgEl.textContent = "Please enter a URL.";
    return;
  }

  // Validate if it's a YouTube URL
  if (!isValidYouTubeUrl(inputUrl)) {
    fetchMsgEl.textContent = "Please enter a valid YouTube URL.";
    return;
  }

  try {
    fetchMsgEl.textContent = "Fetching video...";
    updateProgressBar(true);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress > 90) clearInterval(progressInterval);
      updateProgressBar(true, progress);
    }, 200);

    const result = await invoke("fetch", { url: inputUrl });
    const videoInfo = JSON.parse(result);

    if (!videoInfo.title) {
      throw new Error("No video information found.");
    }

    let infoHtml = `
      <table>
        <tr><th>Title</th><td>${videoInfo.title}</td></tr>
        <tr><th>Author</th><td>${videoInfo.author}</td></tr>
        <tr><th>Length</th><td>${(videoInfo.length_seconds / 60).toFixed(2)} min</td></tr>
        <tr><th>File Size</th><td>${videoInfo.filesize_mb || 'Not available'} MB</td></tr>
      </table>
    `;

    fetchMsgEl.innerHTML = infoHtml;
    console.log("Video fetch successful");

    clearInterval(progressInterval);
    updateProgressBar(true, 100);
    setTimeout(() => updateProgressBar(false), 500);

  } catch (error) {
    console.error("Error fetching video:", error);

    // Display a user-friendly error message
    let errorMessage;
    if (error.message.includes("No video information found")) {
      errorMessage = "The video information could not be retrieved. Please check the URL.";
    } else if (error.message.includes("video unavailable")) {
      errorMessage = "The video is unavailable. Please check the URL and try again.";
    } else {
      errorMessage = "An error occurred while fetching the video. Please try again later.";
    }

    fetchMsgEl.textContent = errorMessage;
    updateProgressBar(false);
  }
}
// video dl
async function downloadVideo() {
  console.log("download video function called");

  if (!fetchInputEl.value.trim()) {
    fetchMsgEl.textContent = "Please enter a valid URL first";
    return;
  }

  try {
    fetchMsgEl.textContent = "Downloading video...";
    updateProgressBar(true);

    const result = await invoke("download", { url: fetchInputEl.value });
    fetchMsgEl.textContent = result;
    console.log("video download successful");

    updateProgressBar(true, 100);
    setTimeout(() => updateProgressBar(false), 500);
  } catch (error) {
    console.error("error downloading video:", error);
    fetchMsgEl.textContent = `Error downloading video: ${error}`;
    updateProgressBar(false);
  }
}
// audio dl
async function downloadAudio() {
  console.log("download audio function called");

  if (!fetchInputEl.value.trim()) {
    fetchMsgEl.textContent = "Please enter a valid URL first";
    return;
  }

  try {
    fetchMsgEl.textContent = "Downloading audio...";
    updateProgressBar(true);

    const result = await invoke("download_audio_only", { url: fetchInputEl.value });
    fetchMsgEl.textContent = result;
    console.log("audio download successful");

    updateProgressBar(true, 100);
    setTimeout(() => updateProgressBar(false), 500);
  } catch (error) {
    console.error("error downloading audio:", error);
    fetchMsgEl.textContent = `Error downloading audio: ${error}`;
    updateProgressBar(false);
  }
}
// DOM
window.addEventListener("DOMContentLoaded", () => {
  // el fields
  titlebarEl = document.querySelector("#titlebar");
  fetchInputEl = document.querySelector("#fetch-input");
  fetchMsgEl = document.querySelector("#fetch-msg");
  progressBarEl = document.querySelector("#progress-bar");

  // titlebar btn fields
  closeBtn = document.querySelector(".close-btn");
  refreshBtn = document.querySelector(".refresh-btn");

  // drag titlebar
  titlebarEl.addEventListener("mousedown", (e) => {
    appWindow.startDragging();
  });

  // title btn events
  closeBtn.addEventListener("click", closeApp);
  refreshBtn.addEventListener("click", refreshWebview);

  // main btn events
  document.querySelector("#fetch-form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetchVideo();
  });

  document.querySelector("#download-button").addEventListener("click", (e) => {
    e.preventDefault();
    downloadVideo();
  });

  document.querySelector("#download-audio-button").addEventListener("click", (e) => {
    e.preventDefault();
    downloadAudio();
  });

  document.querySelector("#clear-button").addEventListener("click", (e) => {
    e.preventDefault();
    clearAll();
  });
});

// clear all fields
function clearAll() {
  console.log("Clear All finction called");
  fetchInputEl.value = '';
  fetchMsgEl.innerHTML = '';
  updateProgressBar(false);
}
// progressbar
function updateProgressBar(show, progress = 0) {
  if (show) {
    progressBarEl.style.width = `${progress}%`;
    progressBarEl.style.display = 'block';
    progressBarEl.classList.remove('fade-out');
  } else {
    progressBarEl.classList.add('fade-out');
    setTimeout(() => {
      progressBarEl.style.display = 'none';
      progressBarEl.classList.remove('fade-out');
    }, 500);
  }
}
