// // guide: https://developer.chrome.com/docs/extensions/reference/tabs/#method-query

document.addEventListener("DOMContentLoaded", async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = { data: tabs[0], url: tabs[0].url };

  console.log(currentTab.data.id);
  console.log(typeof currentTab.data.id);

  console.log(parseInt(currentTab.data.id));
  console.log(typeof parseInt(currentTab.data.id));

  const dialogBox = document.getElementById("dialog-box");

  if (testYoutubeRegex(currentTab.url)) {
    const { contentID, type } = sliceYoutubeURL(currentTab.url);

    chrome.tabs.create({
      url: `https://myyp.vercel.app/?${type}=${contentID}`,
    });
  } else {
    dialogBox.innerText = "It isn't a youtube link!";
  }
});

function testYoutubeRegex(url) {
  const youtubeRegex = /v=|list=/;
  return youtubeRegex.test(url);
}
//

function sliceYoutubeURL(url) {
  let type;
  let splitter;
  if (url.includes("v=")) {
    type = "video";
    splitter = "v=";
  } else if (url.includes("list=")) {
    type = "playlist";
    splitter = "list=";
  }
  const urlWithoutSplitter = url.split(splitter)[1];
  const contentID = urlWithoutSplitter.split("&")[0];
  return { contentID, type };
}
