import { DOMMessage, DOMMessageResponse } from './types/DOMMessage'
import * as dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

// MMM = Jan-Dec
// MMMM = January-December
// D = Day of month
const dateStringFormats = ["MMM D, YYYY", "MMMM D, YYYY"]

const logoClassName = "column shoot-logo"
const titleClassName = "shoot-title"
const dateClassName = "shoot-date"

// TODO: Adapt this to do the inverse for titles + remove ':' for file names
// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str: string): string {
  // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
  // Most often this is not the case though.
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "\'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/:/g, "")
    .replace(/-/g, "")
    .replace(/[^a-zA-Z1-9&']/g, "");
}

function getTitle(): string {
  const headings = Array.from(document.getElementsByTagName<'h1'>('h1'))
  console.log(headings)
  const shootTitleHeadings = headings.filter(h1 => h1.className !== titleClassName)
  console.log(shootTitleHeadings)
  const siteTitle = Array.from(document.getElementsByTagName<'h1'>('h1')).filter(h1 => h1.className === titleClassName).map(h1 => h1.innerText)[0]
  console.log(siteTitle)
  const escapedTitle = escapeHTML(siteTitle)
  console.log(escapedTitle)
  return escapedTitle
}

function getDate(): string {
  const dateAsWritten = document.getElementsByClassName(dateClassName)[0].innerHTML
  console.log(dateAsWritten)
  const date = dayjs(dateAsWritten, dateStringFormats)
  console.log(date)
  return `${date.format("YYYY-MM-DD")}`
}

function getSite(): string {
  const elements = document.getElementsByClassName(logoClassName)
  console.log('className Elements: ', elements)
  const aElems = elements[0].getElementsByTagName<'a'>('a')
  console.log('className Elements: ', aElems)
  const siteHref = aElems[0].getAttribute('href')
  console.log(siteHref)
  const channels = siteHref.split('/')
  console.log(channels)
  const words = channels.pop().split("-");
  console.log(words)
  const site = words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  console.log(site)
  return site
}

function getVideoUrl() {
  const buttonElm = document.getElementsByClassName("download")[0]
  console.log(buttonElm)
  const linksElms = Array.from(buttonElm.getElementsByTagName<'a'>('a'))
  console.log(linksElms)
  const links = linksElms.map(l => l.href)
  console.log(links)
  // Assumes highest quality will be last in list
  const downloadUrl = links.pop()
  console.log(downloadUrl)
  return downloadUrl
}

const messageFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
  console.log('[content.js]. Message recieved: ', msg)

  const site = getSite()
  const title = getTitle()
  const date = getDate()
  const url = getVideoUrl()

  const response: DOMMessageResponse = {
    title: title,
    site: site,
    date: date,
    url: url
  };

  console.log('[content.js]. Message response: ', response)
  sendResponse(response)
}

chrome.runtime.onMessage.addListener(messageFromReactAppListener);