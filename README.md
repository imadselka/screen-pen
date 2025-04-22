# Screen Pen

An Electron-based desktop application that lets you draw directly on your screen. Perfect for presentations, highlighting content, or quick annotations without switching between applications.

![Screen Pen Demo](screenshots/demo.png)

## Features

- 🖌️ Draw on top of any application
- 🔄 Toggle visibility with a keyboard shortcut
- 🎨 Multiple colors (red, green, blue)
- ✏️ Adjustable pen and eraser sizes
- 🧹 Erase mode
- 🧼 Clear screen option
- 🖱️ Custom cursors that reflect current tool
- ⚡ Global shortcuts for quick access

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Setup

1. Clone the repository or download the source code:
   ```
   git clone https://github.com/yourusername/screen-pen.git
   cd screen-pen
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

### Building Executables

To create an executable for your platform:

```
npm install --save-dev electron-builder
```

Add the following to your package.json scripts section:
```json
"scripts": {
  "start": "electron .",
  "build": "electron-builder"
}
```

Then run:
```
npm run build
```

Look for the packaged application in the `dist` folder.

## Usage

### Global Shortcuts

- `Ctrl+Alt+P`: Toggle the application visibility (show/hide)
- `Ctrl+Alt+Q`: Quit the application

### Drawing Controls

While the application is visible:

| Key | Function |
|-----|----------|
| `r` | Switch to red pen |
| `g` | Switch to green pen |
| `b` | Switch to blue pen |
| `e` | Switch to eraser mode |
| `c` | Clear the entire screen |

### Mouse Controls

- **Click and drag**: Draw or erase (depending on selected mode)
- **Release mouse**: Stop drawing

## Project Structure

```
screen-pen/
├── dist/                  # Build output directory
├── node_modules/          # Node.js dependencies
├── public/                # Public assets
│   └── images/            # Cursor images
│       ├── eraser.png
│       └── pen.png
├── index.html             # Application HTML
├── main.js                # Electron main process
├── package-lock.json      # Lock file for dependencies
├── package.json           # Project configuration
├── README.md              # This documentation
└── renderer.js            # Drawing functionality
```

## Customization

### Adding More Colors

To add more color options, modify the keyboard event listener in `renderer.js`:

```javascript
// Example: Add yellow with the 'y' key
document.addEventListener('keydown', (e) => {
  // ... existing code
  else if (e.key === 'y') {
    isErasing = false;
    color = 'yellow';
    changeCursor();
  }
  // ... rest of code
});
```

You'll also need to update the cursor to reflect the new color by modifying the `changeCursor()` function.

### Changing Default Settings

Look for these variables near the top of `renderer.js`:

```javascript
let color = 'red';       // Default pen color
let size = 4;            // Default pen thickness
let eraserSize = 30;     // Default eraser size
```

## Troubleshooting

### Application Won't Start

1. Ensure you have the correct Node.js version installed (v14.0.0 or higher)
2. Check for errors in the terminal when running `npm start`
3. Add the following line to the `createWindow()` function in `main.js` to see debugging information:
   ```javascript
   win.webContents.openDevTools({ mode: 'detach' });
   ```
4. Verify file paths match your actual project structure
5. Make sure the `package.json` file has the correct main entry point:
   ```json
   "main": "main.js"
   ```

### Drawing Doesn't Work

1. Verify the application is visible (press `Ctrl+Alt+P`)
2. Check that you're not in eraser mode (press `r`, `g`, or `b` to switch to pen mode)
3. Try clearing the screen with `c` and drawing again

### Cursor Doesn't Match Current Tool

If you're using custom cursor images:
1. Ensure the image files exist in the `public/images/` directory
2. Make sure both `pen.png` and `eraser.png` are present
3. Check that the image paths in `renderer.js` are correctly pointing to `'public/images/pen.png'` and `'public/images/eraser.png'`

## Advanced Usage

### Screen Capture

You can extend this application to capture screenshots by adding:

```javascript
// Example code for capturing the current screen
const { desktopCapturer } = require('electron');

async function captureScreen() {
  const sources = await desktopCapturer.getSources({ 
    types: ['screen'], 
    thumbnailSize: { width: window.innerWidth, height: window.innerHeight } 
  });
  
  // Use sources[0].thumbnail to get the screenshot
}
```

### Touch Screen Support

Add touch support by including these event listeners:

```javascript
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

// Add similar handlers for 'touchmove' and 'touchend'
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by similar tools like Epic Pen and ZoomIt
- Built with [Electron](https://www.electronjs.org/)
- Thanks to all contributors who have helped improve this project