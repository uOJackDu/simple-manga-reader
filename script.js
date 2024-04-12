const inputFile = document.getElementById("image-input");
const gallery = document.getElementById("gallery");
const menu = document.getElementById("menu");

inputFile.addEventListener("change", handleFileChange);
document.addEventListener("keydown", handleKeyPress);
gallery.addEventListener("click", toggleOpenMenu);
document.getElementById("reverse-toggle").addEventListener("click", toggleReverse);
document.getElementById("single-image-toggle").addEventListener("click", toggleSingleImgFirstPage);

let imgs = [];
let panels = [];

let curPanelIdx = 0;

let reverse = true;
let singleImgFirstPage = true;

function handleFileChange(event) {
  imgs = Array.from(event.target.files)
    .filter((file) => file.type.match("image.*"))
    .sort((a, b) => a.name.localeCompare(b.name));
  displayImgs();
  goToFirstPage();
}

function displayImgs() {
  gallery.innerHTML = ""; // clear
  panels = [];

  for (let i = 0; i < imgs.length; i += 1) {
    const panel = document.createElement("div");
    panel.className = "manga-panel";

    idxs = [i];

    if (!(singleImgFirstPage && i === 0) && i + 1 < imgs.length) {
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
  panels[idx].classList.add("active");
}

function hidePanel(idx) {
  if (idx < 0 || panels.length <= idx) {
    return;
  }
  panels[idx].classList.remove("active");
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