import * as dayjs from 'dayjs'
dayjs.extend(customParseFormat)

// MMM = Jan-Dec
// MMMM = January-December
// D = Day of month
const dateStringFormat = "DD MMM, YYYY"

const MAX_CONCURRENT_DOWNLOADS = 8

// // put value on end of queue
// queue.push(1)

// // take first value from queue
// const var = queue.shift();


// type videoDetails {
//   url: string,
//   fileName: string
// }

let inProgress = []

let queued = []


let latestDownloadId;

/*
Callback from getFileIcon.
Initialize the displayed icon.
*/
function updateIconUrl(iconUrl) {
  let downloadIcon = document.querySelector("#icon");
  downloadIcon.setAttribute("src", iconUrl);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// TODO: Update id tag
function getTitle() {
  return document.querySelector("#title").textContent()
}

// TODO: Update id tag
function getDate() {
  const dateAsWritten = document.querySelector("#date").textContent()
  if(!dateAsWritten){
    return "No_Date"
  } else {
    // TODO: this will almost certainly need a more indepth parsing
    // const date = Date.parse(dateAsWritten)
    const date = dayjs(dateAsWritten, dateStringFormat)
    return `${date.format("YYYY-MM-DD")}`
  }
}

// TODO: Update img tag
function getSite() {
  const siteLogo = document.querySelector('#logo').getAttribute("alt-text")
  // TODO: alt text probably isnt going to be perfect for this
  return siteLogo
}


/*
Fetch title, date and site and create title
*/
function getFileName() {
  const title = getTitle()
  const date = getDate()
  const site = getSite()

  return `${site} - ${date} - ${title}.mp4`
}

// TODO: Add download to downloading queue (get name from id lookup)
function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`)
  inProgress.push(id)
}

function onFailed(error) {
  console.log(`Download failed: ${error}`)
}

function downloadVideoFile(videoUrl, fileName) {
  let downloading = browser.downloads.download({
    url: videoUrl, 
    filename: fileName, 
    incognito: true, 
    saveAs: true})

  downloading.then(onStartedDownload, onFailed)
}

/*
If there was a download item,
- remember its ID as latestDownloadId
- initialize the displayed icon using getFileIcon
- initialize the displayed URL 
If there wasn't a download item, disable the "open" and "remove" buttons.
*/
function initializeLatestDownload(downloadItems) {
  let downloadUrl = document.querySelector("#url");
  if (downloadItems.length > 0) {
    latestDownloadId = downloadItems[0].id;
    let gettingIconUrl = browser.downloads.getFileIcon(latestDownloadId);
    gettingIconUrl.then(updateIconUrl, onError);
    downloadUrl.textContent = downloadItems[0].url;
    document.querySelector("#open").classList.remove("disabled");
    document.querySelector("#remove").classList.remove("disabled");
  } else {
    downloadUrl.textContent = "No downloaded items found."
    document.querySelector("#open").classList.add("disabled");
    document.querySelector("#remove").classList.add("disabled");
  }
}

/*
Search for the most recent download, and pass it to initializeLatestDownload()
*/
let searching = browser.downloads.search({
  limit: 1,
  orderBy: ["-startTime"]
});
searching.then(initializeLatestDownload);

/*
Open the item using the associated application.
*/
function openItem() {
  if (!document.querySelector("#open").classList.contains("disabled")) {
    browser.downloads.open(latestDownloadId);
  }
}

/*
Remove item from disk (removeFile) and from the download history (erase)
*/
function removeItem() {
  if (!document.querySelector("#remove").classList.contains("disabled")) {
    browser.downloads.removeFile(latestDownloadId);
    browser.downloads.erase({id: latestDownloadId});
    window.close();
  }
}

document.querySelector("#open").addEventListener("click", openItem);
document.querySelector("#remove").addEventListener("click", removeItem);

function handleDownloaChanged(delta) {
  if (delta.state && delta.state.current === 'complete') {
    console.log(`Download ${delta.id} has completed.`);
    // Remove item from inProgress list
    inProgress = inProgress.filter(item => item !== delta.id)
    // TODO: trigger next item in queue here?
  }
}

browser.downloads.onChanged.addListener(handleChanged);