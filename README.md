# CSS Dark Mode Toggle

THIS EXTENSION DOES VERY LITTLE ON ITS OWN AND IS ONLY USEFUL WITH CUSTOM CSS (NOT INCLUDED)

A Roam Research extension that adds a button to the topbar to toggle custom CSS dark modes.

## How It Works

This extension adds and removes the `.rm-dark-theme` CSS class from the document body and HTML element. Custom theme maintainers (or the adventurous) can add support for this in several ways but I recommend using `:root` variables:

```css
:root {
  /* REGULAR THEME COLOR VARIABLES */
}

:root .rm-dark-theme {
  /* DARK MODE COLOR THEME VARIABLES */
}
```

## Features

- **State Persistence**: Your dark mode preference is saved and syncs across devices
- **Keyboard Accessible**: Toggle dark mode via command palette (Cmd/Ctrl+P → "Toggle Dark Mode"), assign custom hotkeys via Roam's settings
- **Topbar Button**: Quick toggle button in the topbar with moon/sun icons
- **Optional Simple Theme**: Built-in inverted dark theme that works out of the box

## Settings

- **Add Simple Dark Theme CSS**: Adds a basic inverted dark theme to your `[[roam/css]]` page

## Example

<img src="https://raw.githubusercontent.com/8bitgentleman/roam-depo-dark-toggle/main/example.gif" width="800"></img>
