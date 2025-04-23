const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let color = 'red';
let size = 4;
let isErasing = false; // Track eraser mode
let eraserSize = 30;  // Size of the eraser

// Paths for the cursor images
const penCursor = '../public/images/pen.png';  // Replace with your pen icon path
const eraserCursor = '../public/images/eraser.png';  // Replace with your eraser icon path

canvas.addEventListener('mousedown', () => {
  drawing = true;
  ctx.beginPath();
});
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = size;
  ctx.lineCap = 'round';

  if (isErasing) {
    ctx.clearRect(e.clientX - eraserSize / 2, e.clientY - eraserSize / 2, eraserSize, eraserSize); // Erase
  } else {
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }
}

// Change cursor based on the mode
function changeCursor() {
  if (isErasing) {
    canvas.style.cursor = `url(${eraserCursor}), auto`;  // Set eraser cursor
  } else {
    canvas.style.cursor = `url(${penCursor}), auto`;  // Set pen cursor
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'e') {
    isErasing = true;  // Enable eraser mode
    changeCursor();    // Change cursor to eraser
  } else if (e.key === 'r') {
    isErasing = false; // Disable eraser mode (draw with red pen)
    color = 'red';
    changeCursor();    // Change cursor to pen
  } else if (e.key === 'g') {
    isErasing = false; // Disable eraser mode (draw with green pen)
    color = 'green';
    changeCursor();    // Change cursor to pen
  } else if (e.key === 'b') {
    isErasing = false; // Disable eraser mode (draw with blue pen)
    color = 'blue';
    changeCursor();    // Change cursor to pen
  } else if (e.key === 'c') {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear all
  }
});
