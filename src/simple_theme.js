/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v2  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes 
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme
// custom themes 

function uidForToday() {
    let roamDate = new Date(Date.now());
    let today = window.roamAlphaAPI.util.dateToPageTitle(roamDate);
    return today
  }

function getPageUidByPageTitle(title){
    return roamAlphaAPI.q(
        `[:find (pull ?e [:block/uid]) :where [?e :node/title "${title}"]]`
        )?.[0]?.[0].uid || null
}

function createPage(title){
    // creates the roam/css page if it does not exist
    let pageUID = roamAlphaAPI.util.generateUID()
    roamAlphaAPI.data
        .page.create(
            {"page": 
                {"title": title, 
                "uid": pageUID}})
    return pageUID;
}

function createCodeBlock(pageUID, parentUID, blockUID){
    // creates the initial code block and its parent
    // adding this to the roam/css page so users can use it as an example
    // create closed parent block
    roamAlphaAPI
    .createBlock(
        {"location": 
            {"parent-uid": pageUID, 
            "order": 0}, 
        "block": 
            {"string": `SIMPLE CSS DARK THEME [[${uidForToday()}]]`,
            "uid":parentUID,
            "open":false,
            "heading":3}})
    
    // create codeblock for a simple dark theme
    // I do this so that a user can see and modify the CSS
    let css = `
        :root{
            /*REGULAR THEME COLOR VARIABLES*/
        }
        :root .rm-dark-theme {
            /*DARK MODE COLOR THEME VARIABLES*/
            --background:#000;
            --text:#fff;
        }
        html.rm-dark-theme   {
            filter: invert(100%);
            -webkit-filter: invert(100%);
            -webkit-transition: .8s -webkit-filter ease;
            transition: .8s filter ease, .8s -webkit-filter ease;
        
        }
        .rm-dark-theme .roam-sidebar-container{
            background-color: var(--text) !important;
            transition: .8s background-color ease;
        }
        .rm-dark-theme img {
            filter: invert(100%) !important;
            -webkit-filter: invert(100%) !important;
            -webkit-transition: .8s -webkit-filter ease;
            transition: .8s filter ease, .8s -webkit-filter ease;
        }
        .rm-dark-theme .rm-extensions-marketplace, 
        .rm-dark-theme .rm-extensions-marketplace-search,
        .rm-dark-theme .rm-settings>*,
        .rm-dark-theme .rm-settings-tabs>*,
        .rm-dark-theme .rm-settings--desktop .rm-settings-tabs .bp3-tab-list,
        .rm-dark-theme .bp3-tabs.bp3-vertical>.bp3-tab-panel,
        .rm-dark-theme .rm-extensions-settings,
        .rm-dark-theme .rm-settings--desktop .rm-settings__tab:not(.rm-settings__panel-wrapper){
            background-color:white !important;
            color:black !important;
        }
        .rm-dark-theme .rm-extensions-marketplace .rm-extension-small:hover{
            color:white !important;
          }
        .rm-dark-theme codemirror-colorview{
            filter: invert(100%) !important;
        }
    `;

    let blockString = "```css\n " + css + " ```"
    roamAlphaAPI
    .createBlock(
        {"location": 
            {"parent-uid": parentUID, 
            "order": 0}, 
        "block": 
            {"uid": blockUID,
            "string": blockString}})

}

function removeCodeBlock(uid){
    roamAlphaAPI.deleteBlock({"block":{"uid": uid}})
}

export default function toggleSimpleCSS(state) {
    let codeBlockParentUID = 'dark-theme-css-parent';
    let codeBlockUID = 'dark-theme-css';
    if (state==true) {
        let cssPageName = 'roam/css'
        // if roam/css page doesn't exist then create it
        let pageUID = getPageUidByPageTitle(cssPageName) || createPage(cssPageName);

        createCodeBlock(pageUID, codeBlockParentUID, codeBlockUID)
    } else if(state==false){
        removeCodeBlock(codeBlockParentUID)
    }
}
