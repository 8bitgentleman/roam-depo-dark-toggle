All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
