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
    const videoCode = sliceYoutubeURL(currentTab.url);

    chrome.tabs.create({
      url: `https://youtube-player-smoky.vercel.app/?v=${videoCode}`,
    });
  } else {
    dialogBox.innerText = "It isn't a youtube article link!";
  }
});

function testYoutubeRegex(url) {
  const youtubeRegex = /v=/;
  return youtubeRegex.test(url);
}
//

function sliceYoutubeURL(url) {
  const urlWithoutV = url.split("v=")[1];
  const videoCode = urlWithoutV.split("&")[0];
  return videoCode;
}
