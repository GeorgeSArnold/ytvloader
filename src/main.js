const { invoke } = window.__TAURI__.tauri;

let fetchInputEl;
let fetchMsgEl;
let downloadMsgEl;
let downloadAudioMsgEl;

// clear
let clearButtonEl;

// progress
let fetchProgressEl;
let progressBarEl;

async function fetchVideo() {
  console.log("Fetch video function called");
  
  // Check if the input is empty
  if (!fetchInputEl.value.trim()) {
    fetchMsgEl.textContent = "Please enter a valid URL";
    return; // Exit the function early
  }

  try {
    fetchMsgEl.textContent = "Fetching...";
    updateProgressBar(true);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress > 90) clearInterval(progressInterval);
      updateProgressBar(true, progress);
    }, 200);

    const result = await invoke("fetch", { url: fetchInputEl.value });
    const videoInfo = JSON.parse(result);
    
    let infoHtml = `
      <table>
        <tr><th>Title</th><td>${videoInfo.title}</td></tr>
        <tr><th>Author</th><td>${videoInfo.author}</td></tr>
        <tr><th>Length</th><td>${(videoInfo.length_seconds / 60).toFixed(2)} min</td></tr>
      </table>
    `;
    
    fetchMsgEl.innerHTML = infoHtml;
    console.log("Video fetch successful");

    clearInterval(progressInterval);
    updateProgressBar(true, 100);
    setTimeout(() => updateProgressBar(false), 500);

  } catch (error) {
    console.error("Error fetching video:", error);
    fetchMsgEl.textContent = `Error: ${error}`;
    updateProgressBar(false);
  }
}

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

window.addEventListener("DOMContentLoaded", () => {
  fetchInputEl = document.querySelector("#fetch-input");
  fetchMsgEl = document.querySelector("#fetch-msg");
  progressBarEl = document.querySelector("#progress-bar");

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

function clearAll() {
  fetchInputEl.value = '';
  fetchMsgEl.innerHTML = '';
  updateProgressBar(false);
}

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