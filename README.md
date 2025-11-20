# CSS Dark Mode Toggle

A modern Roam Research extension for toggling dark mode with persistence and system preference support.

## Features

- **State Persistence**: Your dark mode preference is saved and syncs across devices using Roam's extension settings
- **System Preference Detection**: Automatically detect and follow your OS dark mode setting
- **Keyboard Accessible**: Toggle dark mode via command palette (Cmd/Ctrl+P → "Toggle Dark Mode")
- **Topbar Button**: Quick toggle button in the topbar with moon/sun icons
- **Optional Simple Theme**: Built-in inverted dark theme that works out of the box

## How It Works

This extension adds and removes the `.rm-dark-theme` CSS class from the document body and HTML element. Custom theme maintainers can add dark mode support using `:root` variables:

```css
:root {
  /* REGULAR THEME COLOR VARIABLES */
}

:root .rm-dark-theme {
  /* DARK MODE COLOR THEME VARIABLES */
}
```

## Settings

Access settings via the Roam Depot settings panel:

- **Add Simple Dark Theme CSS**: Adds a basic inverted dark theme to your `[[roam/css]]` page
- **Follow System Dark Mode Preference**: Automatically sync with your OS dark mode setting

## Usage

1. Click the moon/sun icon in the topbar to toggle dark mode
2. Use the command palette: Press Cmd/Ctrl+P, type "Toggle Dark Mode", and press Enter
3. Your preference is automatically saved and restored on page reload

## For Theme Developers

Custom themes can support this extension by targeting the `.rm-dark-theme` class on either `body` or `html` elements. The extension applies the class to both for maximum compatibility.

## Example

<img src="https://raw.githubusercontent.com/8bitgentleman/roam-depo-dark-toggle/main/example.gif" width="800"></img>

## Version History

### v2.0.0 (Latest)
- Added state persistence using extensionAPI.settings
- Added system dark mode preference detection
- Added command palette integration for keyboard accessibility
- Improved DOM queries for better performance
- Added comprehensive error handling
- Better keyboard support (Enter/Space keys)
