/* Original code by matt vogel */
  /* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
  /* v2  */
  // THIS EXTENSION DOES VERY LITTLE ON ITS OWN
  // adds a button to the topbar to allow toggling of custom CSS modes 
  // it works by adding and removing the css class `.rm-dark-theme` from the document body
  // custom themes 

function toggleDarkMode() {    
    if (document.body.classList.contains("rm-dark-theme")){
        // switch to light mode
        let lbtn = document.getElementsByClassName('bp3-icon-flash')[0];
        lbtn.classList.remove('bp3-icon-flash');
        lbtn.classList.add('bp3-icon-moon');
        document.body.classList.toggle("rm-dark-theme")
    } else {
        // switch to dark mode
        let btn = document.getElementsByClassName('bp3-icon-moon')[0];
        btn.classList.remove('bp3-icon-moon');
        btn.classList.add('bp3-icon-flash');
        document.body.classList.toggle("rm-dark-theme")
        
    }
}

function createToggle() {  
    const createIconButton = (icon) => {
        const popoverButton = document.createElement("span");
        popoverButton.className = "bp3-button bp3-minimal bp3-small dm-toggle";
        popoverButton.tabIndex = 0;

        const popoverIcon = document.createElement("span");
        popoverIcon.className = `bp3-icon bp3-icon-${icon}`;

        popoverButton.appendChild(popoverIcon);

        return popoverButton;
    };
    var iconName = 'moon'
    var nameToUse = 'toggleDarkMode';

    var checkForButton = document.getElementById(`${nameToUse}-flex-space`);
    if (!checkForButton) {
        var mainButton = createIconButton(iconName);
        var roamTopbar = document.getElementsByClassName("rm-topbar");

        var nextIconButton = roamTopbar[0].lastElementChild;
        var flexDiv = document.createElement("div");
        flexDiv.className = "rm-topbar__spacer-sm dm-toggle";
        flexDiv.id = nameToUse + "-flex-space";

        var flexDivAfter = document.createElement("div");
        flexDivAfter.className = "rm-topbar__spacer-sm dm-toggle";
        flexDivAfter.id = nameToUse + "-flex-space-after";
        
        nextIconButton.insertAdjacentElement("afterend", mainButton);
        mainButton.insertAdjacentElement("beforebegin", flexDiv);
        mainButton.insertAdjacentElement("afterend", flexDivAfter);
        mainButton.addEventListener("click", toggleDarkMode);
    }
}

function destroyToggle(){
    // remove the dark mode flag from the body
    document.body.classList.remove("rm-dark-theme")
    // remove all parts of the button
    const toggles = document.querySelectorAll('.dm-toggle');
    console.log(toggles)
    toggles.forEach(tog => {
        tog.remove();
    });
}
    


export default {
  onload: () => {
    console.log("load dark mode toggle plugin")
    createToggle()
  },
  onunload: () => {
    console.log("unload dark mode toggle plugin")
    destroyToggle()
  }
};