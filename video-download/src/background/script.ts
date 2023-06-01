//Every time a tab is created...
chrome.tabs.onCreated.addListener((tab) => {
    //run this code 
    console.log(`You just created a tab with id: ${tab.id}`)
});