# CSS Dark Mode Toggle

A modern Roam Research extension for toggling dark mode with persistence and system preference support.

## Features

- **3-State Toggle**: Cycle between Light, Dark, and Auto modes with a single click
- **Auto Mode**: Automatically follows your OS dark mode setting
- **State Persistence**: Your preference syncs across devices using Roam's extension settings
- **Keyboard Accessible**: Multiple command palette options for quick access
- **Topbar Button**: Visual indicator showing current mode
- **Optional Simple Theme**: Built-in inverted dark theme that works out of the box

## How It Works

Click the topbar button to cycle through modes:

1. **Light Mode** (moon icon) - Forces light theme
2. **Dark Mode** (flash icon) - Forces dark theme
3. **Auto Mode** (sync icon) - Follows system preference

The extension adds/removes the `.rm-dark-theme` CSS class from the document. Custom themes can add dark mode support using `:root` variables:

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

## Usage

**Via Topbar Button:**
Click to cycle: Light -> Dark -> Auto -> Light...

**Via Command Palette (Cmd/Ctrl+P):**
- "Theme: Cycle Mode (Light/Dark/Auto)" - Cycle to next mode
- "Theme: Set Light Mode" - Jump directly to light
- "Theme: Set Dark Mode" - Jump directly to dark
- "Theme: Set Auto Mode" - Jump directly to auto

## For Theme Developers

Custom themes can support this extension by targeting the `.rm-dark-theme` class on either `body` or `html` elements. The extension applies the class to both for maximum compatibility.

## Example

<img src="https://raw.githubusercontent.com/8bitgentleman/roam-depo-dark-toggle/main/example.gif" width="800"></img>

## Version History

### v2.1.0 (Latest)
- New 3-state toggle: Light / Dark / Auto
- Auto mode follows system preference in real-time
- Simplified settings (removed separate toggle for system preference)
- Added multiple command palette commands for direct mode selection
- Legacy settings migration support

### v2.0.0
- Added state persistence using extensionAPI.settings
- Added system dark mode preference detection
- Added command palette integration for keyboard accessibility
- Improved DOM queries for better performance
- Added comprehensive error handling
- Better keyboard support (Enter/Space keys)
