const fileSelection = document.getElementById("file-selection");
const selectFileButton = document.getElementById("select-file-button");
const imgInput = document.getElementById("image-input");
const gallery = document.getElementById("gallery");
const menu = document.getElementById("menu");

selectFileButton.addEventListener("click", () => imgInput.click());
imgInput.addEventListener("change", handleFileChange);
document.addEventListener("keydown", handleKeyPress);
gallery.addEventListener("click", toggleOpenMenu);
document.getElementById("reverse-toggle").addEventListener("click", toggleReverse);
document.getElementById("single-image-first-page-toggle")
  .addEventListener("click", toggleSingleImgFirstPage);
document.getElementById("single-page-mode-toggle").addEventListener("click", toggleSinglePageMode);

let imgs = [];
let panels = [];

let curPanelIdx = 0;

let reverse = true;
let singleImgFirstPage = true;
let singlePageMode = false;

function handleFileChange(event) {
  imgs = Array.from(event.target.files)
    .filter((file) => file.type.match("image.*"))
    .sort((a, b) => a.name.localeCompare(b.name));
  showGallery();
  displayImgs();
  goToFirstPage();
}

function showGallery() {
  fileSelection.style.display = "none";
  gallery.style.display = "block";
}

function displayImgs() {
  gallery.innerHTML = ""; // clear
  panels = [];

  for (let i = 0; i < imgs.length; i += 1) {
    const panel = document.createElement("div");
    panel.className = "manga-panel";

    idxs = [i];

    if (!singlePageMode && !(singleImgFirstPage && i === 0) && i + 1 < imgs.length) {
      idxs.push(i + 1);
      i += 1;
    }
    if (reverse) {
      idxs.reverse();
    }
    idxs.forEach(idx => addImgToPanel(idx, panel));

    panels.push(panel);
    gallery.appendChild(panel);
  }
  if (reverse) {
    panels.reverse();
  }
  goToPanel(curPanelIdx);
}

function addImgToPanel(idx, panel) {
  let img = document.createElement("img");
  img.src = URL.createObjectURL(imgs[idx]);
  panel.appendChild(img);
}

function showPanel(idx) {
  if (idx < 0 || panels.length <= idx) {
    return;
  }
  panels[idx].style.opacity = "1";
}

function hidePanel(idx) {
  if (idx < 0 || panels.length <= idx) {
    return;
  }
  panels[idx].style.opacity = "0";
}

function goToPanel(idx) {
  idx = Math.max(0, idx);
  idx = Math.min(idx, panels.length - 1);

  let prevPanelIdx = curPanelIdx;
  curPanelIdx = idx;

  showPanel(idx);
  if (prevPanelIdx !== curPanelIdx) {
    hidePanel(prevPanelIdx);
  }
  updateGalleryOverflow();
}

function updateGalleryOverflow() {
  gallery.style.width = "auto"; // first reset gallery width

  const panel = panels[curPanelIdx];
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
  goToPanel(panels.length - 1);
}

function goToFirstPage() {
  let idx = reverse ? panels.length - 1 : 0;
  goToPanel(idx);
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
  curPanelIdx = (panels.length - 1) - curPanelIdx;
  displayImgs();
}

function toggleSingleImgFirstPage() {
  singleImgFirstPage = !singleImgFirstPage;
  displayImgs();
}

function toggleSinglePageMode() {
  singlePageMode = !singlePageMode;
  displayImgs();
}
