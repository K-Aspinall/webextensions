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