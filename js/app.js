//insert SVGs from file
function swapSVGs() {
  const nodes = document.querySelectorAll(`.svg-container`);

  nodes.forEach((node) => {
    const name = node.dataset.name;

    fetch(`./assets/${name}.svg`)
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        svgElement.classList = node.dataset.classes;

        node.appendChild(svgElement);
      });
  });
}

const overlay = document.querySelector("#overlay");
let currentSublay = null;
function initializeOverlayHide() {
  overlay.addEventListener("click", (event) => {
    // INSIDE THE OVERLAY BUT OUTSIDE THE SUBLAY (i.e. user clicks edge/border)
    if (currentSublay != null && !currentSublay.contains(event.target)) {
      overlay.style.display = "none";
    }
  });
}

const imgOverlay = document.querySelector("#img-overlay");
function initializeIMGOverlayHide() {
  imgOverlay.addEventListener("click", (event) => {
    imgOverlay.style.display = "none";
  });
}

const hwPopElements = document.querySelectorAll(".hw-pop");
const sublayElements = document.querySelectorAll(".SUBLAY");
function initializeHWPops() {
  hwPopElements.forEach((element) => {
    element.addEventListener("click", () => {
      // Show the overlay
      overlay.style.display = "flex";

      // Hide all sublay elements
      sublayElements.forEach((sublay) => {
        sublay.style.display = "none";
      });

      // Show the target sublay element
      const targetId = element.getAttribute("data-target");
      console.log(`targetID: ${targetId}`);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        currentSublay = targetElement;
        targetElement.style.display = "flex";
      }
    });
  });
}

const imgOverlayImg = document.querySelector("#img-overlay img");
function initializeImgPops() {
  const imgPopElements = document.querySelectorAll(".img-pop");
  imgPopElements.forEach((element) => {
    element.addEventListener("click", () => {
      //set image-overlay img
      imgOverlayImg.src = element.src;

      // Show the overlay
      imgOverlay.style.display = "flex";
    });
  });
}

function pairHoverTwins() {
  const pairedHoverElements = document.querySelectorAll(".paired-hover");
  pairedHoverElements.forEach((element) => {
    element.addEventListener("mouseover", () =>
      toggleHoverClass(element.getAttribute("data-twin"), true)
    );
    element.addEventListener("mouseout", () =>
      toggleHoverClass(element.getAttribute("data-twin"), false)
    );
  });
}

function toggleHoverClass(twin, add) {
  document
    .querySelectorAll(`.paired-hover[data-twin="${twin}"]`)
    .forEach((element) => {
      if (add) {
        if (element.classList.contains("hex-selector")) {
          element.classList.add("hover");
        } else {
          element.classList.add("hover-fill");
        }
      } else {
        element.classList.remove("hover");
        element.classList.remove("hover-fill");
      }
    });
}

const hexSelectors = document.querySelectorAll(".hex-selector");
const hexatiles = document.querySelectorAll(".big-hex");
function initializeHexSelectors() {
  hexSelectors.forEach((element) => {
    element.addEventListener("click", () => {
      // Add activated class (makes icon gold)
      const dataTwinSel = element.getAttribute("data-twin");
      hexSelectors.forEach((elementN) => {
        if (
          elementN == element ||
          (dataTwinSel != null &&
            elementN.getAttribute("data-twin") == dataTwinSel)
        ) {
          elementN.classList.add("activated");
        } else {
          elementN.classList.remove("activated");
        }
      });

      const hexatileId = element.getAttribute("data-hex");
      hexatiles.forEach((hexatile) => {
        // Show the targeted/connected hex
        if (hexatile.id == `hex-${hexatileId}`) {
          hexatile.classList.remove("hidden");
          hexatile.classList.add("grid");
        }
        // Or hide all the others
        else {
          hexatile.classList.add("hidden");
          hexatile.classList.remove("grid");
        }
      });
    });
  });
}

const cThemeObjects = document.querySelectorAll(".ctheme");

let currColorTheme = "slate";
function colorThemeSwap() {
  let newTheme = "purple";
  if (currColorTheme == "purple") {
    newTheme = "slate";
  }

  cThemeObjects.forEach((element) => {
    element.classList.forEach((className) => {
      if (className.includes(currColorTheme)) {
        const newClassName = className.replace(currColorTheme, newTheme);
        element.classList.replace(className, newClassName);
      } else if (className.includes(newTheme)) {
        const newClassName = className.replace(newTheme, currColorTheme);
        element.classList.replace(className, newClassName);
      }
    });
  });

  document.body.classList.remove(`${currColorTheme}-mode`);
  currColorTheme = newTheme;
  document.body.classList.add(`${currColorTheme}-mode`);
}

//Invert Tailwind color classes
//E.g. bg-slate-900/70 will become bg-slate-100/70
const colorScaleMap = {
  50: "950",
  100: "900",
  200: "800",
  300: "700",
  400: "600",
  500: "500",
  600: "400",
  700: "300",
  800: "200",
  900: "100",
  950: "50",
};
function flipColorScale(className, colorTheme) {
  //Other cases with colors
  const regex = new RegExp(`(${colorTheme}-(\\d{2,3}))(/\\d{2})?$`);
  return className.replace(regex, (match, p1, p2, p3) => {
    const oppositeScale = colorScaleMap[p2];
    return `${colorTheme}-${oppositeScale}${p3 || ""}`;
  });
}

//Toggle between light and dark themes by:
// 1) Swap some images between *-dark to *-white versions
// 2) Toggle between .dark-mode and .light-mode on body
// 3) Invert all tailwind color classes
// 4) Swap from bg-black to bg-white
const cThemeImgs = document.querySelectorAll(".img-swap");
let dlMode = "dark";
function lightDarkThemeSwap() {
  // 1) Swap some images between *-dark to *-white versions
  cThemeImgs.forEach((element) => {
    let srcUrl = element.getAttribute("src");
    if (dlMode == "dark") {
      srcUrl = srcUrl.replace("black", "white");
    } else {
      srcUrl = srcUrl.replace("white", "black");
    }
    element.setAttribute("src", srcUrl);
  });

  // 2) Toggle between .dark-mode and .light-mode on body
  document.body.classList.remove(`${dlMode}-mode`);
  if (dlMode == "dark") {
    dlMode = "light";
  } else {
    dlMode = "dark";
  }
  document.body.classList.add(`${dlMode}-mode`);

  // 2) Invert all tailwind color classes AND
  // 3) Swap from bg-black to bg-white
  cThemeObjects.forEach((element) => {
    element.classList.forEach((className) => {
      if (className.includes("slate") || className.includes("purple")) {
        const colorTheme = className.includes("slate") ? "slate" : "purple";
        const newClassName = flipColorScale(className, colorTheme);
        element.classList.replace(className, newClassName);
      } else {
        //Special cases bg-black / bg-white
        if (className == "bg-white") {
          element.classList.replace(className, "bg-black");
        }
        if (className == "bg-black") {
          element.classList.replace(className, "bg-white");
        }
      }
    });
  });
}

function initializeThemeToggles() {
  const cThemeBtns = document.querySelectorAll(".ctheme-btn");
  cThemeBtns.forEach((cThemeBtn) => {
    cThemeBtn.addEventListener("click", colorThemeSwap);
  });

  const drkThemeBtns = document.querySelectorAll(".darktheme-btn");
  drkThemeBtns.forEach((drkThemeBtn) => {
    drkThemeBtn.addEventListener("click", lightDarkThemeSwap);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  swapSVGs();
  initializeOverlayHide();
  initializeIMGOverlayHide();
  initializeHWPops();
  initializeImgPops();
  pairHoverTwins();
  initializeHexSelectors();
  initializeThemeToggles();
  console.log("Initializers called!");
});
