All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [v2.0.1]() (2026-11-13)

### Bug Fixes
* **Simple theme CSS no longer deleted**: disabling, updating or reloading the extension used to delete the "SIMPLE CSS DARK THEME" block from `[[roam/css]]` (including any edits) while the setting stayed on. The block is now left alone; only turning off "Add Simple Dark Theme CSS" removes it.
* **One-time restore**: if the setting is on but the block is missing after updating, the stock CSS is added back once per device. Turn the setting off if you no longer want it.
* **Fresh installs no longer start in dark mode**: the "not yet set" check missed Roam's `null` for unsaved settings, so new installs switched dark mode on (with the "off" icon showing) on every load until toggled. Users still in that state are reset to light mode once.

## [v2.0.0]() (2025-11-20)

### Features
* **State Persistence**: Dark mode preference now persists across page reloads and syncs across devices using extensionAPI.settings
* **Command Palette Integration**: Added "Toggle Dark Mode" command for keyboard accessibility (allows custom hotkey assignment via Roam's settings)
* **ARIA Labels**: Added accessibility labels to the toggle button

### Enhancements
* **Performance**: Replaced inefficient `getElementsByClassName` with `querySelector`
* **Performance**: Use `document.documentElement` instead of `getElementsByTagName('html')[0]`
* **Error Handling**: Added comprehensive try-catch blocks around all API calls
* **Code Quality**: Improved null checking and error messages

### Refactors
* Modernized codebase to use Roam extension API best practices
* Separated concerns between state management and UI updates
* Added proper cleanup on extension unload

## [v2.0]() (2022-07-08)

### Refactors
* Refactored for the new Roam Depot (!)

## v1.5 (2022-04-11)

### Features

* added sun to moon transition


## v1 (2022-02-19)

### Features

* initial commit 

### Bug Fixes

### Enhancements

### Refactors

### Documentation
