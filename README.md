# Yoly Highlight Chrome Extension

## Overview

Yoly Highlight is a powerful Chrome extension that leverages OpenAI's GPT model to intelligently highlight important content on web pages. This tool is designed to help users quickly identify and understand key information, enhancing reading efficiency.

## Features

- Smart Highlighting: Automatically identifies and highlights important text and phrases on web pages.
- Customizable System Prompt: Allows users to customize the AI model's system prompt for better control over highlighting behavior.
- Minimalist UI: A small floating button that doesn't interfere with the browsing experience.
- Toggle Highlighting: Easily turn highlighting on and off.
- Dark Mode Compatible: Automatically adjusts highlight styles to suit dark-themed websites.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/cctuan/yoly-ai-highlighter-extension.git
   ```
2. Navigate to the project directory:
   ```
   cd yoly-ai-highlighter-extension
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the extension:
   ```
   npm run build
   ```

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the extension's build directory (typically `build/chrome-mv3-prod/`)

## Usage Instructions

1. After installation, you'll see a new icon in Chrome's top-right corner.
2. Click the icon to open the settings page and enter your OpenAI API key.
3. Browse any webpage, and you'll see a small circular button in the bottom-right corner.
4. Click the button to start the AI analysis and highlighting process.
5. Click the button again to remove the highlights.

## Configuration

In the extension's settings page, you can:

- Enter your OpenAI API key
- Customize the system prompt to control the AI's highlighting behavior

## Development

This project is developed using the Plasmo framework. Key files include:

- `content.ts`: Contains content script logic
- `options.tsx`: React component for the settings page
- `style.css`: Defines the extension's styles

To run the extension in development mode:

```
npm run dev
```

## Contributing

Pull requests are welcome to improve the extension. Before submitting, please ensure your code adheres to the existing coding style and passes all tests.

## License

## Contact

For any questions or suggestions, please open an issue or contact the project maintainer directly.

---

Thank you for using the AI Highlight Chrome Extension!