# 8D Problem Solving Assistant

An intelligent web application to guide users through the 8D (Eight Disciplines) problem-solving process. Track, manage, and document corrective actions from planning to team recognition, with AI-powered assistance to streamline content creation.

## Features

- **Structured 8D Process:** Guides users through all 8 disciplines, from D0 (Plan) to D8 (Congratulate Your Team).
- **Multiple Report Management:** Create and manage multiple 8D reports, all stored locally in your browser.
- **AI-Powered Assistance:** Uses Google's Gemini API to provide suggestions and generate content for each discipline, helping to overcome writer's block.
- **File Attachments:** Attach evidence files, including "OK" and "NOK" sample images, to build a comprehensive report.
- **Auto-Save:** All changes are automatically saved to your browser's local storage, so you never lose your progress.
- **Progress Tracking:** The main menu provides an at-a-glance view of the completion status and next revision date for each report.
- **Print-Friendly:** Generate a clean, printable version of your final report.
- **Offline First:** The application is designed to work offline thanks to a service worker.
- **Responsive Design:** A clean, modern, and responsive UI that works on all screen sizes.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Storage:** Browser Local Storage
- **Offline Support:** Service Workers
- **Dependencies:** No build step required, dependencies are loaded via an `importmap`.

## Getting Started

This project is designed to run directly in a modern browser without a build step.

### Prerequisites

- A modern web browser that supports ES Modules and Import Maps (e.g., Chrome, Firefox, Edge).
- A Google Gemini API key.

### Running the Application

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/your-username/8d-problem-solving-app.git
    cd 8d-problem-solving-app
    ```

2.  **Set up your API Key:**
    The application expects the Google Gemini API key to be available in `process.env.API_KEY`. The execution environment is expected to provide this variable. For local development, you could temporarily add a script tag to your `index.html` head to define this, but remember to **never commit your API key to version control**.

3.  **Serve the files:**
    You need to serve the project files from a local web server. You cannot open `index.html` directly from the filesystem due to CORS restrictions with ES modules.
    
    If you have Python installed:
    ```bash
    python -m http.server
    ```
    
    Or if you have Node.js and `serve` installed (`npm install -g serve`):
    ```bash
    serve .
    ```

4.  **Open in browser:**
    Navigate to the URL provided by your local server (e.g., `http://localhost:8000` or `http://localhost:3000`).
