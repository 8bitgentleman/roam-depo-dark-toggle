# CSS dark mode toggle
THIS EXTENSION DOES VERY LITTLE ON ITS OWN AND IS ONLY USEFUL WITH CUSTOM CSS (NOT INCLUDED)

This extension adds a button to the topbar to allow toggling of custom CSS modes. It works by adding and removing the css class `.rm-dark-theme` from the document body.
Custom theme maintainers (or the adventurous) can add support for this in several ways but I recommend using `:root` variables.

```
:root{
	//REGULAR THEME COLOR VARIABLES
}
:root .rm-dark-theme {
	//DARK MODE COLOR THEME VARIABLES
}
```

## Example 
Here is an example integrating the toggle into a pre-existing theme

<img src="https://raw.githubusercontent.com/8bitgentleman/roam-depo-dark-toggle/main/example.gif" width="800"></img>
