All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [v2.1.0]() (2025-11-21)

### Features
* **3-State Toggle**: New cycling toggle between Light, Dark, and Auto modes
* **Auto Mode**: Follows system dark mode preference in real-time
* **Direct Mode Commands**: Command palette now includes direct access to each mode
* **Legacy Migration**: Automatically migrates settings from v2.0.0

### Enhancements
* **Simplified Settings**: Removed separate "Follow System Preference" toggle (now built into 3-state cycle)
* **Better Icons**: Each mode has a distinct icon (moon, flash, automatic-updates)
* **Improved UX**: Single button cycles through all modes intuitively

### Refactors
* Restructured state management around mode concept instead of boolean
* Cleaner separation between theme application and mode management

## [v2.0.0]() (2025-11-20)

### Features
* **State Persistence**: Dark mode preference now persists across page reloads and syncs across devices using extensionAPI.settings
* **System Preference Detection**: Added automatic detection and following of OS dark mode setting
* **Command Palette Integration**: Added "Toggle Dark Mode" command for keyboard accessibility
* **Better Keyboard Support**: Enhanced keyboard navigation with Enter/Space key support on toggle button
* **ARIA Labels**: Added accessibility labels to the toggle button

### Enhancements
* **Performance**: Replaced inefficient `getElementsByClassName` with `querySelector`
* **Performance**: Use `document.documentElement` instead of `getElementsByTagName('html')[0]`
* **Error Handling**: Added comprehensive try-catch blocks around all API calls
* **Code Quality**: Improved null checking and error messages
* **User Experience**: Extension now applies system dark mode preference on first load

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
