const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colors = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImage = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// global variables with defualt value
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
(selectedTool = "brush"), (brushWidth = 5), (selectedColor = "000");

const setCanvasBackground = () => {
  // setting whole canvas background to white, so the downloaded img background will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; // setting fillStyle back to the selected Color, it'll be the brush color
};

window.addEventListener("load", () => {
  // selecting canvas widht/height. offsetwidth/height returns viewable width/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // if fillColor isn't checked draw a react with boarder else draw react with background
  if (!fillColor.checked) {
    // creating rectangle according to the mouse poiner
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); // creating new path to draw circle
  // getting readus for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating cicle aaccording to the mouse pointer
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill cricle else draw border circle
};

const drawTriangle = (e) => {
  ctx.beginPath(); // creating new path to draw triangle
  ctx.moveTo(prevMouseX, prevMouseY); // moving traingle to the mouse ponter
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  ctx.closePath(); // closing path of a traingle, so the third line draw automatically
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border triangle
};

const drawLine = (e) => {
  ctx.beginPath(); // creating new path to draw line
  ctx.moveTo(prevMouseX, prevMouseY); // moving line to the mouse ponter
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.stroke();
};

const startdDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // passing current mouseX as prevMouseX value
  prevMouseY = e.offsetY; // passing current mouseY as prevMouseY value
  ctx.beginPath(); // creating new path to draw
  ctx.lineWidth = brushWidth; //passing brushSize as line width
  //copyind canvas data & passing as snapshot value.. this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = selectedColor; //passing selected as stroke style
  ctx.fillStyle = selectedColor; //passing selected as fill style style
};

const stopDrawing = () => {
  isDrawing = false;
};

const drawing = (e) => {
  if (!isDrawing) return; // if drawing is false return from here
  ctx.putImageData(snapshot, 0, 0); // ading copied canvas on to this canvas
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke(); // drawing/filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "line") {
    drawLine(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all tool option.
    //removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // passing slider value as brush size

colors.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all color button
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    // passing selected btn background color as selectedColor value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // passing picked color value from picker to last color btn background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
  setCanvasBackground();
});

saveImage.addEventListener("click", () => {
  const link = document.createElement("a"); // creating <a> element
  link.download = `${Date.now()}.jpg`; // passing current date as link download value
  link.href = canvas.toDataURL(); // passing canvasData as link download value
  link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startdDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
