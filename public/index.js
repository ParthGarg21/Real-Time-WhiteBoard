const canvas = document.querySelector("canvas");

const body = document.body;

const pen = canvas.getContext("2d");

// getBoundingClientRect gives us the coordinates of the canvas

const yOffSet = canvas.getBoundingClientRect().top;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 130;

pen.lineWidth = 5;

// ====================================================

// Drawing Section

let allStrokes = [];
let currStroke;
let deletedStrokes = [];

let isDraw = false;

canvas.addEventListener("mousedown", handleDrawTrigger);

canvas.addEventListener("mousemove", handleDraw);

canvas.addEventListener("mouseup", handleDrawTurnoff);

function handleDrawTrigger(event) {
  currStroke = {
    color: pen.strokeStyle,
    width: pen.lineWidth,
    pos: [],
  };

  isDraw = true;
  pen.beginPath();
  const xCoord = event.clientX;
  const yCoord = event.clientY - yOffSet;
  pen.moveTo(xCoord, yCoord);
}

function handleDraw(event) {
  if (isDraw) {
    deletedStrokes = [];
    const xCoord = event.clientX;
    const yCoord = event.clientY - yOffSet;
    pen.lineTo(xCoord, yCoord);
    pen.stroke();
    currStroke.pos.push([xCoord, yCoord]);
  }
}

function handleDrawTurnoff() {
  allStrokes.push(currStroke);
  currStroke = undefined;
  isDraw = false;
}

// ====================================================

// Options section

const options = document.querySelectorAll(".option");

for (let option of options) {
  option.addEventListener("click", handleCilck);
}

function handleCilck() {
  for (let option of options) {
    option.classList.remove("selected");
  }

  const currOption = this;

  currOption.classList.add("selected");

  const optionName = currOption.getAttribute("id");

  if (optionName === "pencil") {
    pen.strokeStyle = "black";
  } else if (optionName === "eraser") {
    pen.strokeStyle = "white";
  } else if (optionName === "sticky") {
    createStickyNote();
  } else if (optionName === "undo") {
    undoMaker();
  } else if (optionName === "redo") {
    redoMaker();
  } else {
    downloadBoard();
  }
}

// ====================================================

// Sticky note maker

function createStickyNote() {
  const stickyNote = document.createElement("div");
  const stickyHead = document.createElement("div");
  const note = document.createElement("p");
  const headMenu = document.createElement("div");
  const minimizeIcn = document.createElement("i");
  const closeIcn = document.createElement("i");
  const stickyCon = document.createElement("div");
  const text = document.createElement("textarea");

  stickyNote.classList.add("sticky-note");
  stickyHead.classList.add("sticky-head");
  note.classList.add("head-options", "note");
  headMenu.classList.add("head-options", "head-menu");
  minimizeIcn.classList.add("sticky-head-options", "fas", "fa-window-minimize");
  closeIcn.classList.add("sticky-head-options", "fas", "fa-times");
  stickyCon.classList.add("sticky-con");
  text.classList.add("sticky-text");

  stickyCon.appendChild(text);
  headMenu.appendChild(minimizeIcn);
  headMenu.appendChild(closeIcn);
  note.innerText = "NOTE";
  stickyHead.appendChild(note);
  stickyHead.appendChild(headMenu);

  stickyNote.appendChild(stickyHead);
  stickyNote.appendChild(stickyCon);

  body.appendChild(stickyNote);

  // Each time, we will have to add this event listener to the newly created object

  // Sets the isMove to true
  stickyHead.addEventListener("mousedown", triggerMove);

  // Unsets the ismove
  stickyHead.addEventListener("mouseup", moveTurnOff);

  // Adding event listener to the minimize button

  minimizeIcn.addEventListener("click", handleMaxMin);

  // Adding event listener to the closing button

  closeIcn.addEventListener("click", handleClose);
}

// Sticky Note mover, maximize and minimize

let isMove = false;
let oldXCoord;
let oldYCoord;
let currNote;

// Whichever note trigered the mousedown, the currNote is set to taht object

function triggerMove(event) {
  oldXCoord = event.clientX;
  oldYCoord = event.clientY;
  isMove = true;
  currNote = this.parentElement;
}

// Adding an event listener to the entire document which moves the current stickynote

document.addEventListener("mousemove", handleMove);

function handleMove(event) {
  if (isMove && currNote != undefined) {
    const newXCoord = event.clientX;
    const newYCoord = event.clientY;
    const xDisp = newXCoord - oldXCoord;
    const yDisp = newYCoord - oldYCoord;
    const note = currNote;
    const noteX = note.getBoundingClientRect().left + xDisp + "px";
    const noteY = note.getBoundingClientRect().top + yDisp + "px";
    note.style.top = noteY;
    note.style.left = noteX;
    oldXCoord = newXCoord;
    oldYCoord = newYCoord;
  }
}

function moveTurnOff() {
  currNote = undefined;
  isMove = false;
}

function handleMaxMin() {
  const currBtn = this;
  const currHead = currBtn.parentElement.parentElement;
  const currCon = currHead.nextElementSibling;
  currCon.classList.toggle("min");
  currBtn.classList.toggle("fa-window-minimize");
  currBtn.classList.toggle("fa-window-maximize");
}

function handleClose() {
  const currBtn = this;
  const currHead = currBtn.parentElement.parentElement.parentElement;
  body.removeChild(currHead);
}

// ====================================================

// Palette mover
const paletteHead = document.querySelector(".palette-head");

const expand = document.querySelector(".expand");
let isPalMove = false;

paletteHead.addEventListener("mousedown", triggerPalMove);

document.addEventListener("mousemove", handlePalMove);

paletteHead.addEventListener("mouseup", palMoveTurnOff);

function triggerPalMove(event) {
  oldXCoord = event.clientX;
  oldYCoord = event.clientY;
  isPalMove = true;
}

function palMoveTurnOff() {
  isPalMove = false;
}

function handlePalMove(event) {
  if (isPalMove) {
    const newXCoord = event.clientX;
    const newYCoord = event.clientY;
    const xDisp = newXCoord - oldXCoord;
    const yDisp = newYCoord - oldYCoord;

    const palette = paletteHead.parentElement;
    const palX = palette.getBoundingClientRect().left + xDisp + "px";
    const palY = palette.getBoundingClientRect().top + yDisp + "px";

    palette.style.left = palX;
    palette.style.top = palY;

    oldXCoord = newXCoord;
    oldYCoord = newYCoord;
  }
}

expand.addEventListener("click", handleExpandPalette);

function handleExpandPalette() {
  const colRow = paletteHead.nextElementSibling;

  expand.classList.toggle("fa-chevron-down");
  expand.classList.toggle("fa-chevron-up");

  colRow.classList.toggle("min");
  paletteHead.classList.toggle("bor-rad");
}

// ====================================================

// Color and Size Picker

const colors = document.querySelectorAll(".color");

for (let color of colors) {
  color.addEventListener("click", handleColor);
}

function handleColor() {
  for (let option of options) {
    if (option.getAttribute("id") === "pencil") {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  }
  const color = this;
  pen.strokeStyle = color.getAttribute("id");
}

const sizes = document.querySelectorAll(".size");

for (let size of sizes) {
  size.addEventListener("click", handleSize);
}

function handleSize() {
  const size = this.getAttribute("id");
  if (size === "small") {
    pen.lineWidth = 5;
  } else if (size === "medium") {
    pen.lineWidth = 10;
  } else {
    pen.lineWidth = 25;
  }
}

// ====================================================

// UNDO Section

// First we'll clear the entire canvas
// After that we'll redraw all the points except the last one

function undoMaker() {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  if (allStrokes.length > 0) {
    deletedStrokes.push(allStrokes[allStrokes.length - 1]);
    allStrokes.pop();
  }
  const prevCol = pen.strokeStyle;
  const prevWt = pen.lineWidth;

  // stroke = {
  //   color, width, positions array
  // }

  for (let stroke of allStrokes) {
    pen.strokeStyle = stroke.color;
    pen.lineWidth = stroke.width;

    pen.beginPath();

    const pos = stroke.pos;

    for (let coord of pos) {
      const xCoord = coord[0];
      const yCoord = coord[1];
      pen.lineTo(xCoord, yCoord);
      pen.stroke();
    }
  }

  pen.beginPath();
  pen.strokeStyle = prevCol;
  pen.lineWidth = prevWt;
}

// ====================================================

// REDO Section
// Most recent stroke will be redone and then it will be popped from
// the redo stack and pushed on the allStrokes one

// If a user makes a new stroke, then the redo stack will be emptied

function redoMaker() {
  if (deletedStrokes.length === 0) {
    return;
  }

  const prevCol = pen.strokeStyle;
  const prevWt = pen.lineWidth;

  // stroke = {
  //   color, width, positions array
  // }

  const stroke = deletedStrokes.pop();
  allStrokes.push(stroke);
  pen.lineWidth = stroke.width;
  pen.strokeStyle = stroke.color;

  const pos = stroke.pos;

  for (let coord of pos) {
    const xCoord = coord[0];
    const yCoord = coord[1];

    pen.lineTo(xCoord, yCoord);
    pen.stroke();
  }

  pen.beginPath();
  pen.strokeStyle = prevCol;
  pen.lineWidth = prevWt;
}

// Keydown event for redo and undo

document.addEventListener("keydown", handleKeyRedoUndo);

function handleKeyRedoUndo(event) {
  const key = event.key;
  if (event.ctrlKey && key === "z") {
    const undo = document.querySelector("#undo");
    undo.click();
  }
  if (event.ctrlKey && key == "y") {
    const redo = document.querySelector("#redo");
    redo.click();
  }
}

// ====================================================

// Download Board Section

function downloadBoard() {
  // creating an element

  let a = document.createElement("a");

  // setting the download file name

  a.download = "file.png";

  // setting the url to this download link
  let url = canvas.toDataURL("image/png;base64");
  a.href = url;

  // clicking the link to download

  a.click();

  // Removing the element
  a.remove();
}
