/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v3  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme

import toggleSimpleCSS, { ensureSimpleCSS } from './simple_theme'

let extensionAPI = null;
let toggleButton = null;
let healTimer = null;

// the previous version's unload deleteBlock is fire-and-forget, so an immediate
// check could see the block just before the delete lands and wrongly mark the
// device as healed
const HEAL_DELAY_MS = 3000;

const panelConfig = {
  tabTitle: "Dark Mode Toggle",
  settings: [
      {id:		  "add-simple-theme",
        name:		"Add Simple Dark Theme CSS",
        description: "Adds the CSS for a simple dark mode theme to the [[roam/css]] page",
        action:	  {type:	 "switch",
                      onChange: (evt) => {
                        Promise.resolve(toggleSimpleCSS(evt.target.checked)).catch(console.error);
                        console.log("Switch!", evt.target.checked); }}}
  ]
};

function setDarkMode(isDark) {
    // Update button icon
    const btn = document.querySelector('.dm-toggle .bp3-icon');
    if (btn) {
        if (isDark) {
            btn.classList.remove('bp3-icon-moon');
            btn.classList.add('bp3-icon-flash');
        } else {
            btn.classList.remove('bp3-icon-flash');
            btn.classList.add('bp3-icon-moon');
        }
    }

    // Update theme classes
    const isCurrentlyDark = document.body.classList.contains("rm-dark-theme");
    if (isDark !== isCurrentlyDark) {
        document.body.classList.toggle("rm-dark-theme");
        // Use document.documentElement instead of getElementsByTagName
        document.documentElement.classList.toggle("rm-dark-theme");
    }

    // Persist state
    if (extensionAPI) {
        extensionAPI.settings.set('darkMode', isDark);
    }
}

function toggleDarkMode() {
    const isDark = !document.body.classList.contains("rm-dark-theme");
    setDarkMode(isDark);
}

function createToggle() {
    const createIconButton = (icon) => {
        const popoverButton = document.createElement("span");
        popoverButton.className = "bp3-button bp3-minimal bp3-small dm-toggle";
        popoverButton.tabIndex = 0;
        popoverButton.setAttribute('aria-label', 'Toggle dark mode');

        const popoverIcon = document.createElement("span");
        popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

        popoverButton.appendChild(popoverIcon);

        return popoverButton;
    };

    const iconName = 'moon';
    const nameToUse = 'toggleDarkMode';

    const checkForButton = document.getElementById(`${nameToUse}-flex-space`);
    if (!checkForButton) {
        const roamTopbar = document.querySelector(".rm-topbar");

        if (!roamTopbar) {
            console.warn("Dark Mode Toggle: Could not find topbar, retrying...");
            setTimeout(createToggle, 100);
            return;
        }

        const mainButton = createIconButton(iconName);
        toggleButton = mainButton;

        const nextIconButton = roamTopbar.lastElementChild;
        const flexDiv = document.createElement("div");
        flexDiv.className = "rm-topbar__spacer-sm dm-toggle";
        flexDiv.id = nameToUse + "-flex-space";

        const flexDivAfter = document.createElement("div");
        flexDivAfter.className = "rm-topbar__spacer-sm dm-toggle";
        flexDivAfter.id = nameToUse + "-flex-space-after";

        nextIconButton.insertAdjacentElement("afterend", mainButton);
        mainButton.insertAdjacentElement("beforebegin", flexDiv);
        mainButton.insertAdjacentElement("afterend", flexDivAfter);
        mainButton.addEventListener("click", toggleDarkMode);
    }
}

function destroyToggle(){
    // Remove event listener
    if (toggleButton) {
        toggleButton.removeEventListener("click", toggleDarkMode);
        toggleButton = null;
    }

    // Remove the dark mode flag from both body and html element
    document.body.classList.remove("rm-dark-theme");
    document.documentElement.classList.remove("rm-dark-theme");

    // Remove all parts of the button
    const toggles = document.querySelectorAll('.dm-toggle');
    toggles.forEach(tog => {
        tog.remove();
    });
}


function onload({extensionAPI: api, extension}) {
  console.log("load dark mode toggle plugin");

  // Make extensionAPI accessible globally to the module
  extensionAPI = api;

  extensionAPI.settings.panel.create(panelConfig);

  // Initialize darkMode setting with default value if it doesn't exist
  if (extensionAPI.settings.get('darkMode') === undefined) {
    extensionAPI.settings.set('darkMode', false);
  }

  // Restore saved dark mode state
  const savedDarkMode = extensionAPI.settings.get('darkMode');
  setDarkMode(savedDarkMode);

  createToggle();

  // Add command palette command for keyboard accessibility
  try {
    extensionAPI.ui.commandPalette.addCommand({
      label: "Toggle Dark Mode",
      callback: () => toggleDarkMode()
    });
  } catch (error) {
    console.warn("Dark Mode Toggle: Could not add command palette command:", error);
  }

  healTimer = setTimeout(() => healSimpleTheme(api, extension?.version), HEAL_DELAY_MS);
}

// One-time restore per device and graph of the simple theme block that an older
// version's onunload deleted. The version is stored, not compared: after this
// release nothing deletes the block, so a missing block later means the user
// removed it, and comparing versions would resurrect hand-deleted blocks on
// every update. The marker is per-device (localStorage) because a synced marker
// would let another device's old-version unload delete the block after this
// device healed.
async function healSimpleTheme(api, version) {
  try {
    const key = `dark-mode-toggle:simple-theme-heal:${window.roamAlphaAPI.graph.name}`;
    const hasMarker = () => {
      try { return localStorage.getItem(key) !== null; } catch (e) { return false; }
    };
    const writeMarker = (value) => {
      try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    };

    if (hasMarker()) return;

    if (api.settings.get('add-simple-theme') !== true) {
      writeMarker('off');
      return;
    }

    const r = await ensureSimpleCSS();
    if (r.present) {
      writeMarker(String(version ?? '2.0.1'));
    }
    if (r.created) {
      console.info("Dark Mode Toggle: restored the simple theme CSS block removed by a previous version");
    }
  } catch (error) {
    console.error("Dark Mode Toggle: Error restoring simple theme CSS:", error);
  }
}

function onunload(){
  clearTimeout(healTimer);
  destroyToggle();
  console.log("unload dark mode toggle plugin");
}
export default {
  onload,
  onunload
};