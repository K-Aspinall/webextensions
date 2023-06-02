//Every time a tab is created...
chrome.tabs.onCreated.addListener((tab) => {
    //run this code 
    console.log(`You just created a tab with id: ${tab.id}`)
});

chrome.tabs.onRemoved.addListener((id) => {
    //run this code 
    console.log(`You just deleted a tab with id: ${id}`)
    
});


function clickHandling(e) {
    let target = e.target;
    if(target){
        while ((target.tagName !="A" || !target.href) && target.parentNode) {
            target = target.parentNode;
        }
        if (target.tagName != "A"){
            return;
        }
        console.log("You clicked the link: ", target.href)  
    }
}
window.addEventListener("click", clickHandling);
// const tab = await chrome.tabs.create({url: "https://google.com"})


// TODO: Adapt this to do the inverse for titles + remove ':' for file names
// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
