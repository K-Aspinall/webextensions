import React from 'react';
import { DOMMessage, DOMMessageResponse } from '../types/DOMMessage';

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`)
}

function onFailed(error) {
  console.log(`Download failed: ${error}`)
}

function downloadVideoFile(videoUrl: string, fileName: string) {
  let downloading = chrome.downloads.download({
    url: videoUrl, 
    filename: fileName, 
    saveAs: true})

  downloading.then(onStartedDownload, onFailed)
}

function App() {
  const [title, setTitle] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [site, setSite] = React.useState('');
  const [date, setDate] = React.useState('');
  const [fileName, setFileName] = React.useState('')

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          console.log(response)
          setTitle(response.title);
          setUrl(response.url);
          setSite(response.site);
          setDate(response.date);
          setFileName(`${site} - ${date} - ${title}.mp4`);
        });
    });
  });

  return (
    <div className="App">
      <h1>1-Click download built with React!</h1>

      <ul className="SEOForm">
        <li className="SEOValidation">
          <div className="SEOVAlidationFieldValue">
            {title}
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOVAlidationFieldValue">
            {site}
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOVAlidationFieldValue">
            {date}
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className={`SEOValidationFieldStatus ${url.length > 1 ? 'Error' : 'Ok'}`}>
              {url}
            </span>
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOVAlidationFieldValue">
            {fileName}
          </div>
        </li>

      </ul>

      <button disabled={fileName.length == 0 || url.length == 0}  onClick={() => downloadVideoFile(url, fileName)}>Download</button>
    </div>
  );
}

export default App;