import { DOMMessage, DOMMessageResponse } from './types'

// TODO: Complete implementation using blog.logrocket.com/creating-extension-react-typescript
const messageFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {
    console.log('[content.js]. Message recieved: ', msg)

    const response: DOMMessageResponse = {
        title: document.title,
        headlines: Array.from(document.getElementsByTagName<'h1'>('h1')).map(h1 => h1.innerText)
    };

    console.log('[content.js]. Message response: ', response)
    sendResponse(response)
}

chrome.runtime.onMessage.addListener(messageFromReactAppListener);