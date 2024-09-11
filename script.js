const fileSelection = document.getElementById("file-selection");
const selectFileButton = document.getElementById("select-file-button");
const fileInput = document.getElementById("file-input");
const gallery = document.getElementById("gallery");
const menu = document.getElementById("menu");

selectFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", onFileInputChange);
document.addEventListener("keydown", handleKeyPress);
gallery.addEventListener("click", toggleOpenMenu);
document.getElementById("reverse-toggle").addEventListener("click", toggleReverse);
document.getElementById("single-image-first-page-toggle")
  .addEventListener("click", toggleSingleImgFirstPage);
document.getElementById("single-page-mode-toggle").addEventListener("click", toggleSinglePageMode);

const CHUNK_SIZE = 64;

let imgs = [];
let panelSchema = [];
let panels = [];

let curPanelIdx = 0;

let reverse = true;
let singleImgFirstPage = true;
let singlePageMode = false;

function onFileInputChange(event) {
  imgs = Array.from(event.target.files)
    .filter((file) => file.type.match("image.*"))
    .sort((a, b) => a.name.localeCompare(b.name));
  updatePanelSchema();
  showGallery();
  goToStart();
}

function updatePanelSchema() {
  panelSchema = [];

  for (let i = 0; i < imgs.length; i += 1) {
    let idxs = [i];

    if (!singlePageMode && !(singleImgFirstPage && i === 0) && i + 1 < imgs.length) {
      idxs.push(i + 1);
      i += 1;
    }
    if (reverse) {
      idxs.reverse();
    }
    panelSchema.push(idxs);
  }
  if (reverse) {
    panelSchema.reverse();
  }
}

function showGallery() {
  fileSelection.style.display = "none";
  gallery.style.display = "block";
}

function loadChunk(chunkIdx) {
  gallery.innerHTML = ""; // clear
  panels = [];

  let startIdx = chunkIdx * CHUNK_SIZE;
  let endIdx = Math.min(panelSchema.length, startIdx + CHUNK_SIZE);
  for (let i = startIdx; i < endIdx; i += 1) {
    const panel = document.createElement("div");
    panel.className = "manga-panel";
    panelSchema[i].forEach(idx => addImgToPanel(idx, panel));

    panels.push(panel);
    gallery.appendChild(panel);
  }
}

function addImgToPanel(idx, panel) {
  let img = document.createElement("img");
  img.src = URL.createObjectURL(imgs[idx]);
  panel.appendChild(img);
}

function goToPanel(panelIdx, forceLoadChunk = false) {
  panelIdx = Math.max(0, panelIdx);
  panelIdx = Math.min(panelIdx, panelSchema.length - 1);

  let prevPanelIdx = curPanelIdx;
  curPanelIdx = panelIdx;

  if (forceLoadChunk || getChunkIdx(prevPanelIdx) !== getChunkIdx(curPanelIdx)) {
    loadChunk(getChunkIdx(curPanelIdx));
  }

  showPanel(curPanelIdx);
  if (prevPanelIdx !== curPanelIdx) {
    hidePanel(prevPanelIdx);
  }
  updateGalleryOverflow();
}

function showPanel(panelIdx) {
  panels[getInchunkIdx(panelIdx)].style.opacity = "1";
}

function hidePanel(panelIdx) {
  panels[getInchunkIdx(panelIdx)].style.opacity = "0";
}

function updateGalleryOverflow() {
  gallery.style.width = "auto"; // reset gallery width

  const panel = panels[getInchunkIdx(curPanelIdx)];
  const panelWidth = panel.offsetWidth;
  const galleryWidth = gallery.offsetWidth;

  if (panelWidth > galleryWidth) {
    panel.style.left = "0";
    panel.style.transform = "translate(0, 0)";
    gallery.style.width = `${panelWidth}px`;
  } else {
    panel.style.left = "50%";
    panel.style.transform = "translate(-50%)";
    gallery.style.width = "auto";
  }
}

function getChunkIdx(panelIdx) {
  return Math.floor(panelIdx / CHUNK_SIZE);
}

function getInchunkIdx(panelIdx) {
  return panelIdx % CHUNK_SIZE;
}

function goToNextPanel() {
  goToPanel(curPanelIdx + 1);
}

function goToPrevPanel() {
  goToPanel(curPanelIdx - 1);
}

function goToFirstPanel() {
  goToPanel(0);
}

function goToLastPanel() {
  goToPanel(panelSchema.length - 1);
}

function goToStart() {
  let startPanelIdx = reverse ? panelSchema.length - 1 : 0;
  goToPanel(startPanelIdx, forceLoadChunk = true);
}

function handleKeyPress(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "ArrowRight") {
    goToLastPanel();
  } else if ((event.ctrlKey || event.metaKey) && event.key === "ArrowLeft") {
    goToFirstPanel();
  } else if (event.key === "ArrowRight") {
    goToNextPanel();
  } else if (event.key === "ArrowLeft") {
    goToPrevPanel();
  }
}

function toggleOpenMenu() {
  if (!menu.classList.contains("open")) {
    document.getElementById("menu").classList.add("open");
  } else {
    menu.classList.remove("open");
  }
}

function toggleReverse() {
  reverse = !reverse;

  updatePanelSchema();
  let newPanelIdx = (panelSchema.length - 1) - curPanelIdx;
  goToPanel(newPanelIdx, forceLoadChunk = true);
}

function toggleSingleImgFirstPage() {
  singleImgFirstPage = !singleImgFirstPage;

  updatePanelSchema();
  goToPanel(curPanelIdx, forceLoadChunk = true);
}

function toggleSinglePageMode() {
  singlePageMode = !singlePageMode;

  updatePanelSchema();
  let newPanelIdx = singlePageMode ? 2 * curPanelIdx : Math.floor(curPanelIdx / 2);
  goToPanel(newPanelIdx, forceLoadChunk = true);
}
