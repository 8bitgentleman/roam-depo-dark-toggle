/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v3  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme

import toggleSimpleCSS from './simple_theme'

let extensionAPI = null;
let toggleButton = null;

const panelConfig = {
  tabTitle: "Dark Mode Toggle",
  settings: [
      {id:		  "add-simple-theme",
        name:		"Add Simple Dark Theme CSS",
        description: "Adds the CSS for a simple dark mode theme to the [[roam/css]] page",
        action:	  {type:	 "switch",
                      onChange: (evt) => {
                        toggleSimpleCSS(evt.target.checked);
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


function onload({extensionAPI: api}) {
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
}

function onunload(){
  destroyToggle();
  toggleSimpleCSS(false);
  console.log("unload dark mode toggle plugin");
}
export default {
  onload,
  onunload
};