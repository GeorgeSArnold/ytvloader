# YTVLoader
YTVLoader is a desktop application for downloading YouTube videos and audio. It combines the power of Rust for backend operations with a user-friendly interface created using web technologies and Tauri.

## Features
- Fetch video information from YouTube URLs
- Download videos in various qualities
- Download audio-only versions of videos
- User-friendly interface with modern design

## Technologies Used
- **Rust**: For backend logic and video download functionality
- **Tauri**: Framework for creating desktop applications with web technologies
- **HTML/CSS/JavaScript**: For the user interface
- **yt-dlp**: Python-based tool for downloading YouTube videos

## Prerequisites
Before you begin, ensure you have met the following requirements:
* [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
* [Node.js](https://nodejs.org/) (LTS version)
* [Python](https://www.python.org/downloads/) (3.7 or later)

## Installation
Follow these steps to get YTVLoader up and running on your local machine:

1. **Clone the repository**
git clone https://github.com/GeorgeSArnold/ytvloader.git
cd ytvloader

2. **Install Rust**
- Visit https://www.rust-lang.org/tools/install
- Follow the instructions for your operating system
- Verify installation with: `rustc --version`

3. **Install Node.js and npm**
- Visit https://nodejs.org/
- Download and install the LTS version for your operating system
- Verify installation with: `node --version` and `npm --version`

4. **Install Python**
- Visit https://www.python.org/downloads/
- Download and install the latest version for your operating system
- Verify installation with: `python --version`

5. **Install yt-dlp**
pip install yt-dlp

6. **Install project dependencies**
npm install

## Usage
To run the application in development mode:
npm run tauri dev

To build the application for production:
npm run tauri build

## Contributing
Contributions to YTVLoader are welcome. Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for providing the core functionality for YouTube video downloads
- [Tauri](https://tauri.app/) for enabling the creation of lightweight desktop applications with web technologies

## Contact
Project Link: [https://github.com/GeorgeSArnold/ytvloader](https://github.com/GeorgeSArnold/ytvloader)