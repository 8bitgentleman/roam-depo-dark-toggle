/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v3  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme

import toggleSimpleCSS from './simple_theme'

let extensionAPI = null;
let systemPreferenceListener = null;

// Theme modes: 'light' | 'dark' | 'auto'
let currentMode = 'light';

// Icon mapping for each mode
// moon = light mode active (click to switch to dark)
// flash = dark mode active (click to switch to auto)
// automatic-updates = auto mode active (click to switch to light)
const MODE_ICONS = {
    light: 'moon',
    dark: 'flash',
    auto: 'automatic-updates'
};

const MODE_LABELS = {
    light: 'Light mode (click for dark)',
    dark: 'Dark mode (click for auto)',
    auto: 'Auto mode (click for light)'
};

const MODE_CYCLE = ['light', 'dark', 'auto'];

const panelConfig = {
  tabTitle: "Dark Mode Toggle",
  settings: [
      {id:        "add-simple-theme",
        name:     "Add Simple Dark Theme CSS",
        description: "Adds the CSS for a simple dark mode theme to the [[roam/css]] page",
        action:   {type:     "switch",
                      onChange: (evt) => {
                        toggleSimpleCSS(evt.target.checked);
                        console.log("Switch!", evt.target.checked); }}}
  ]
};

function getSystemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkTheme(isDark) {
    // Update theme classes on body and html
    if (isDark) {
        document.body.classList.add("rm-dark-theme");
        document.documentElement.classList.add("rm-dark-theme");
    } else {
        document.body.classList.remove("rm-dark-theme");
        document.documentElement.classList.remove("rm-dark-theme");
    }
}

function updateButtonIcon(mode) {
    const btn = document.querySelector('.dm-toggle .bp3-icon');
    if (btn) {
        // Remove all possible icon classes
        btn.classList.remove('bp3-icon-moon', 'bp3-icon-flash', 'bp3-icon-automatic-updates');
        // Add the correct icon for current mode
        btn.classList.add(`bp3-icon-${MODE_ICONS[mode]}`);
    }

    // Update aria-label
    const button = document.querySelector('.dm-toggle.bp3-button');
    if (button) {
        button.setAttribute('aria-label', MODE_LABELS[mode]);
    }
}

function setMode(mode) {
    currentMode = mode;

    // Update button icon
    updateButtonIcon(mode);

    // Apply theme based on mode
    if (mode === 'auto') {
        // In auto mode, follow system preference
        applyDarkTheme(getSystemPrefersDark());
        initSystemPreferenceListener();
    } else {
        // In manual mode, remove system listener
        removeSystemPreferenceListener();
        applyDarkTheme(mode === 'dark');
    }

    // Persist state
    if (extensionAPI) {
        extensionAPI.settings.set('themeMode', mode);
    }
}

function cycleMode() {
    const currentIndex = MODE_CYCLE.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_CYCLE.length;
    const nextMode = MODE_CYCLE[nextIndex];
    setMode(nextMode);
}

function initSystemPreferenceListener() {
    if (systemPreferenceListener) return; // Already listening

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemPreferenceListener = (e) => {
        // Only respond if we're in auto mode
        if (currentMode === 'auto') {
            console.log("System dark mode preference changed:", e.matches);
            applyDarkTheme(e.matches);
        }
    };

    mediaQuery.addEventListener('change', systemPreferenceListener);
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
        popoverButton.setAttribute('aria-label', MODE_LABELS[currentMode]);

        const popoverIcon = document.createElement("span");
        popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

        popoverButton.appendChild(popoverIcon);

        return popoverButton;
    };

    const nameToUse = 'toggleDarkMode';

    const checkForButton = document.getElementById(`${nameToUse}-flex-space`);
    if (!checkForButton) {
        const mainButton = createIconButton(MODE_ICONS[currentMode]);
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
        mainButton.addEventListener("click", cycleMode);

        // Add keyboard support (Enter and Space keys)
        mainButton.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cycleMode();
            }
        });
    }
}

function destroyToggle(){
    // remove the dark mode flag from the body
    document.body.classList.remove("rm-dark-theme");
    document.documentElement.classList.remove("rm-dark-theme");
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

    // Restore saved theme mode
    // Support migration from old boolean 'darkMode' setting
    let savedMode = extensionAPI.settings.get('themeMode');

    if (!savedMode) {
        // Check for legacy settings and migrate
        const legacyDarkMode = extensionAPI.settings.get('darkMode');
        const legacyFollowSystem = extensionAPI.settings.get('followSystemPreference');

        if (legacyFollowSystem === true) {
            savedMode = 'auto';
        } else if (legacyDarkMode === true) {
            savedMode = 'dark';
        } else if (legacyDarkMode === false) {
            savedMode = 'light';
        } else {
            // First time load - default to auto
            savedMode = 'auto';
        }
    }

    // Validate saved mode
    if (!MODE_CYCLE.includes(savedMode)) {
        savedMode = 'auto';
    }

    currentMode = savedMode;

    // Create toggle button first (so icon can be updated)
    createToggle();

    // Apply the mode (this will also update the icon)
    setMode(savedMode);

    // Add command palette commands for keyboard accessibility
    try {
        extensionAPI.ui.commandPalette.addCommand({
            label: "Theme: Cycle Mode (Light/Dark/Auto)",
            callback: () => cycleMode()
        });
        extensionAPI.ui.commandPalette.addCommand({
            label: "Theme: Set Light Mode",
            callback: () => setMode('light')
        });
        extensionAPI.ui.commandPalette.addCommand({
            label: "Theme: Set Dark Mode",
            callback: () => setMode('dark')
        });
        extensionAPI.ui.commandPalette.addCommand({
            label: "Theme: Set Auto Mode",
            callback: () => setMode('auto')
        });
    } catch (error) {
        console.warn("Dark Mode Toggle: Could not add command palette commands:", error);
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
