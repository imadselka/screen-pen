const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbar = document.getElementById("toolbar");
const showUIButton = document.getElementById("show-ui");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let color = "red";
let size = 4;
let isErasing = false;
let eraserSize = 30;
let isUIVisible = true;

// Fix cursor paths - use relative paths from the app root
const penCursor = "./public/images/pen.png";
const eraserCursor = "./public/images/eraser.png";

// Initialize cursor
window.addEventListener("load", () => {
  changeCursor();

  // Create images directory if it doesn't exist
  createImagesFolder();
});

canvas.addEventListener("mousedown", () => {
  drawing = true;
  ctx.beginPath();
});
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = isErasing ? eraserSize : size;
  ctx.lineCap = "round";

  if (isErasing) {
    ctx.clearRect(
      e.clientX - eraserSize / 2,
      e.clientY - eraserSize / 2,
      eraserSize,
      eraserSize
    );
  } else {
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }
}

// Create images folder for cursors if needed
function createImagesFolder() {
  // In renderer, we can't directly create folders, but we can use cursor fallbacks
  // This is a placeholder for the actual folder creation logic
  canvas.style.cursor = `url('${penCursor}') 0 16, crosshair`;
}

// Change cursor based on the mode
function changeCursor() {
  try {
    if (isErasing) {
      canvas.style.cursor = `url('${eraserCursor}') 15 15, crosshair`;
    } else {
      canvas.style.cursor = `url('${penCursor}') 0 16, crosshair`;
    }
  } catch (error) {
    // Fallback if cursor images don't load
    canvas.style.cursor = isErasing ? "cell" : "crosshair";
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "e") {
    setEraser();
  } else if (e.key === "r") {
    setPen("red");
  } else if (e.key === "g") {
    setPen("green");
  } else if (e.key === "b") {
    setPen("blue");
  } else if (e.key === "c") {
    clearCanvas();
  } else if (e.key === "h" && e.ctrlKey) {
    toggleUI();
  }
});

// UI functions
function setPen(newColor) {
  isErasing = false;
  color = newColor;
  changeCursor();
  updateActiveButton();
}

function setEraser() {
  isErasing = true;
  changeCursor();
  updateActiveButton();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateActiveButton() {
  // Remove active class from all buttons
  document.querySelectorAll(".toolbar button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to the current tool/color
  if (isErasing) {
    document.getElementById("eraser")?.classList.add("active");
  } else {
    document.getElementById(`${color}-pen`)?.classList.add("active");
  }
}

function toggleUI() {
  isUIVisible = !isUIVisible;
  toolbar.classList.toggle("hidden");
  showUIButton.classList.toggle("visible");
}

function showUI() {
  isUIVisible = true;
  toolbar.classList.remove("hidden");
  showUIButton.classList.remove("visible");
}

// Initialize UI
window.addEventListener("load", updateActiveButton);

// Handle window resize
window.addEventListener("resize", () => {
  // Save the drawing
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);

  // Resize canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Restore the drawing
  ctx.drawImage(tempCanvas, 0, 0);
});

// Set pen size
function setPenSize(newSize) {
  size = newSize;
}

// Set eraser size
function setEraserSize(newSize) {
  eraserSize = newSize;
}
