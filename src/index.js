/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v3  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme

import toggleSimpleCSS from './simple_theme'

let extensionAPI = null;

const panelConfig = {
  tabTitle: "Dark Mode Toggle",
  settings: [
      {id:		  "add-simple-theme",
        name:		"Add Simple Dark Theme CSS",
        description: "Adds the CSS for a simple dark mode theme to the [[roam/css]] page",
        action:	  {type:	 "switch",
                      onChange: (evt) => {
                        toggleSimpleCSS(evt.target.checked);
                        console.log("Switch!", evt.target.checked); }}},
      {id:		  "follow-system-preference",
        name:		"Follow System Dark Mode Preference",
        description: "Automatically switch theme based on your OS dark mode setting",
        action:	  {type:	 "switch",
                      onChange: (evt) => {
                        if (extensionAPI) {
                          extensionAPI.settings.set('followSystemPreference', evt.target.checked);
                          if (evt.target.checked) {
                            initSystemPreferenceListener();
                          } else {
                            removeSystemPreferenceListener();
                          }
                        }
                        console.log("Follow system preference:", evt.target.checked); }}}
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

let systemPreferenceListener = null;

function initSystemPreferenceListener() {
    if (systemPreferenceListener) return; // Already listening

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemPreferenceListener = (e) => {
        console.log("System dark mode preference changed:", e.matches);
        setDarkMode(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', systemPreferenceListener);

    // Apply current system preference
    const followSystemPref = extensionAPI?.settings.get('followSystemPreference');
    if (followSystemPref) {
        setDarkMode(mediaQuery.matches);
    }
}

function removeSystemPreferenceListener() {
    if (systemPreferenceListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', systemPreferenceListener);
        systemPreferenceListener = null;
    }
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
        const mainButton = createIconButton(iconName);
        const roamTopbar = document.querySelector(".rm-topbar");

        if (!roamTopbar) {
            console.warn("Dark Mode Toggle: Could not find topbar");
            return;
        }

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

        // Add keyboard support (Enter and Space keys)
        mainButton.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
    }
}

function destroyToggle(){
    // remove the dark mode flag from the body
    document.body.classList.remove("rm-dark-theme")
    // remove all parts of the button
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

  // Restore saved dark mode state
  const savedDarkMode = extensionAPI.settings.get('darkMode');
  if (savedDarkMode === true) {
    setDarkMode(true);
  } else if (savedDarkMode === false) {
    setDarkMode(false);
  } else {
    // First time load - check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }

  // Initialize system preference listener if enabled
  const followSystemPref = extensionAPI.settings.get('followSystemPreference');
  if (followSystemPref) {
    initSystemPreferenceListener();
  }

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
  removeSystemPreferenceListener();
  destroyToggle();
  toggleSimpleCSS(false);
  console.log("unload dark mode toggle plugin");
}
export default {
  onload,
  onunload
};