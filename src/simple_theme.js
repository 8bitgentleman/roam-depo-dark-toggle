/* Original code by matt vogel */
/* Source: https://github.com/8bitgentleman/roam-depo-dark-toggle  */
/* v3  */
// THIS EXTENSION DOES VERY LITTLE ON ITS OWN
// adds a button to the topbar to allow toggling of custom CSS modes 
// it works by adding and removing the css class `.rm-dark-theme` from the document body
// there is also an option to add a simple inverted dark theme
// custom themes 

function uidForToday() {
    try {
        let roamDate = new Date(Date.now());
        let today = window.roamAlphaAPI.util.dateToPageTitle(roamDate);
        return today;
    } catch (error) {
        console.error("Dark Mode Toggle: Error getting today's date:", error);
        return null;
    }
}

function getPageUidByPageTitle(title){
    try {
        return roamAlphaAPI.q(
            `[:find (pull ?e [:block/uid]) :where [?e :node/title "${title}"]]`
        )?.[0]?.[0]?.uid || null;
    } catch (error) {
        console.error("Dark Mode Toggle: Error finding page:", error);
        return null;
    }
}

async function createPage(title){
    // creates the roam/css page if it does not exist
    const pageUID = roamAlphaAPI.util.generateUID();
    try {
        await roamAlphaAPI.data
            .page.create(
                {"page":
                    {"title": title,
                    "uid": pageUID}});
        return pageUID;
    } catch (error) {
        // the page may have been created concurrently, so re-check by title
        const existing = getPageUidByPageTitle(title);
        if (!existing) {
            console.error("Dark Mode Toggle: Error creating page:", error);
        }
        return existing;
    }
}

function blockExists(uid){
    const res = roamAlphaAPI.q(
        `[:find ?e :where [?e :block/uid "${uid}"]]`
    );
    return !!res && res.length > 0;
}

function childCount(uid){
    const n = roamAlphaAPI.q(
        `[:find (count ?c) . :where [?p :block/uid "${uid}"] [?p :block/children ?c]]`
    );
    return n || 0;
}

async function createParentBlock(pageUID, parentUID){
    // creates the closed parent block of the simple theme
    // adding this to the roam/css page so users can use it as an example
    const today = uidForToday();
    await roamAlphaAPI
    .createBlock(
        {"location":
            {"parent-uid": pageUID,
            "order": "last"},
        "block":
            {"string": `SIMPLE CSS DARK THEME [[${today}]]`,
            "uid":parentUID,
            "open":false,
            "heading":3}});
}

async function createChildBlock(parentUID, blockUID){
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

        let blockString = "```css\n " + css + " ```";
        await roamAlphaAPI
        .createBlock(
            {"location":
                {"parent-uid": parentUID,
                "order": 0},
            "block":
                {"uid": blockUID,
                "string": blockString}});
}

function removeCodeBlock(uid){
    try {
        roamAlphaAPI.deleteBlock({"block":{"uid": uid}});
    } catch (error) {
        console.error("Dark Mode Toggle: Error removing code block:", error);
    }
}

// Using fixed UIDs allows users to easily find and modify the CSS block
// This is intentional for user convenience
const codeBlockParentUID = 'dark-theme-css-parent';
const codeBlockUID = 'dark-theme-css';

let ensureInFlight = null;

async function ensure(){
    try {
        const parentExists = blockExists(codeBlockParentUID);
        const childExists = blockExists(codeBlockUID);

        if (parentExists) {
            if (childExists || childCount(codeBlockParentUID) >= 1) {
                return {present: true, created: false};
            }
            await createChildBlock(codeBlockParentUID, codeBlockUID);
            return {present: true, created: true};
        }
        if (childExists) {
            return {present: true, created: false};
        }

        const cssPageName = 'roam/css';
        let pageUID = getPageUidByPageTitle(cssPageName);
        if (!pageUID) {
            pageUID = await createPage(cssPageName);
        }
        if (!pageUID) {
            throw new Error("Could not create or find roam/css page");
        }
        await createParentBlock(pageUID, codeBlockParentUID);
        await createChildBlock(codeBlockParentUID, codeBlockUID);
        return {present: true, created: true};
    } catch (error) {
        try {
            if (blockExists(codeBlockParentUID) || blockExists(codeBlockUID)) {
                return {present: true, created: false};
            }
        } catch (_) { /* fall through */ }
        console.error("Dark Mode Toggle: Error ensuring simple CSS:", error);
        return {present: false, created: false};
    }
}

export function ensureSimpleCSS(){
    if (!ensureInFlight) {
        ensureInFlight = ensure().finally(() => { ensureInFlight = null; });
    }
    return ensureInFlight;
}

export default function toggleSimpleCSS(state) {
    try {
        if (state === true) {
            return ensureSimpleCSS();
        } else if(state === false){
            removeCodeBlock(codeBlockParentUID);
        }
    } catch (error) {
        console.error("Dark Mode Toggle: Error toggling simple CSS:", error);
    }
}
