let env;

if (window.location.hostname === "localhost") {
  env = prompt("Choose your backend environment (dev/prod).");
}

console.log(env);

let apiURL =
  !env || env === "prod" ? "https://ynsfab.deta.dev" : "http://127.0.0.1:8000";

console.log(apiURL);

const addPlaylistIframe = (listID) => {
  // src="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY"
  return `<iframe width="750" height="450" src="https://www.youtube.com/embed?listType=playlist&list=${listID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

const addVideoIframe = (videoID) => {
  // src="https://www.youtube.com/embed/tgbNymZ7vqY"
  return `<iframe width="750" height="450" src="https://www.youtube.com/embed/${videoID}?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

let contentIDElement = document.querySelector("#contentID");
let contentTypeElement = document.querySelector("#contentType");

function showContent(value = null, type = null) {
  if (document.querySelector("#download")) {
    resetDownloadData();
    resetVideoInfo();
    resetPageTitle();
    document.querySelector("#download").style.display = "none";
    document.querySelector("#description").style.display = "none";
  }

  contentID = value || contentIDElement.value;
  contentType = type || contentTypeElement.value;
  console.log(contentType);

  if (contentType === "video")
    document.querySelector("#player").innerHTML = addVideoIframe(contentID);
  else if (contentType === "playlist")
    document.querySelector("#player").innerHTML = addPlaylistIframe(contentID);

  getDownloadData((type = contentType), (id = contentID))
    .then(extractDownloadData)
    .then(updatePageTitle)
    .then(appendVideoInfo)
    .then((downloadingInfo) => {
      document.querySelector("#description").style.display = "block";
      return downloadingInfo;
    })
    .then(appendDownloadData)
    .then(() => (document.querySelector("#download").style.display = "block"))
    .catch((error) => console.log(error));
}

window.addEventListener("load", () => {
  let queryParams = checkForSharedURL();
  if (!!queryParams) {
    const { type, contentID } = queryParams;
    console.log(queryParams);
    contentIDElement.value = contentID;
    contentTypeElement.value = type;
    showContent(contentID, type);
    return;
  }

  queryParams = extractQueryParams(location.href);
  if (!queryParams) return;

  ["video", "playlist"].some((type) => {
    if (Object.keys(queryParams).includes(type)) {
      const contentId = queryParams[type];
      contentIDElement.value = contentId;
      contentTypeElement.value = type;
      showContent(contentId, type);
      return true;
    } else return false;
  });
});

function extractQueryParams(url) {
  const queries = url.split("?");
  queries.splice(0, 1);
  if (queries.length === 0 || !queries[0]) return;

  const queryParams = queries.reduce((acc, query) => {
    const tempQueryArr = query.split("=");
    acc[tempQueryArr[0]] = tempQueryArr[1];
    return acc;
  }, {});

  console.log(queryParams);
  return queryParams;
}

function scrollToView(element) {
  element.scrollIntoView();
}

async function getDownloadData(type, id) {
  if (type === "playlist") return; // TODO remove this when you fix the playlist
  const url = `${apiURL}/${type}?id=${id}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
}

function extractDownloadData(jsonData) {
  console.log(jsonData);
  const links = [];
  jsonData.quality.forEach((value) => {
    value = value.split("");
    value.pop();
    value = value.join("");
    const downloadData = jsonData.formats[0].find(
      (format) => String(format.height) === String(value)
    );
    links.push({
      quality: value,
      url: downloadData?.url ?? null,
    });
  });
  return { title: jsonData.title, description: jsonData.description, links };
}

const downloadingQualitiesList = document.querySelector("#qualities");
function appendDownloadData(downloadingInfo) {
  downloadingInfo.links.forEach((linkObject) => {
    const newAnchor = document.createElement("a");
    newAnchor.innerText = linkObject.quality + "p";
    newAnchor.setAttribute("href", linkObject.url);
    newAnchor.setAttribute("download", downloadingInfo.title);
    // newAnchor.addEventListener("click", (e) => {
    //   e.preventDefault();
    // });
    downloadingQualitiesList.appendChild(newAnchor);
  });
  return downloadingInfo;
}
function resetDownloadData() {
  downloadingQualitiesList.innerHTML = "";
}

const descriptionContainer = document.querySelector("#description");
function appendVideoInfo(downloadingInfo) {
  const titleElement = descriptionContainer.querySelector("h2");
  titleElement.innerText = downloadingInfo.title;
  const descriptionElement = descriptionContainer.querySelector("p");
  descriptionElement.innerText = downloadingInfo.description;
  return downloadingInfo;
}
function resetVideoInfo() {
  [...descriptionContainer.children].forEach((el) => {
    el.innerHTML = "";
  });
}

const pageTitleElement = document.querySelector("title");
function updatePageTitle(downloadingInfo) {
  pageTitleElement.innerText = `${downloadingInfo.title} | My Youtube Player`;
  return downloadingInfo;
}
function resetPageTitle() {
  pageTitleElement.innerText = "My Youtube Player";
}
// .........................................

/*
{video:value,playlist:value}

Needed Links Format:
https://youtube-player.vercel.app/?video={code}
https://youtube-player.vercel.app/?playlist={code}

بعد أول مرة هيجليك next page token تبعتها مع الريكويست اللي بعده

https://api.youtubemultidownloader.com/playlist?url=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3DPLv4y5OVUmyFjx4uf_sQunpq8nlQiar_iQ

https://api.youtubemultidownloader.com/playlist?url=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3DPLv4y5OVUmyFjx4uf_sQunpq8nlQiar_iQ&nextPageToken=0LYXQq27682bjNZlsnK43SKeaq6EwbhLVsPEC2UilZqYtEXIq5dAMEl2G5fphkFaLDBM0VnyPA%2BZj7jfOIytDNz9sYMhJZ8rTJi%2F9FvUYctM2PnyCNasIp72GdUtB5ny%2F068bIRd1l%2BUwiMhS5risCrRQzICAeOsxJX%2BYehi6GWcMNcSSgFZMoBtP4JQ23Jq

*/

function checkForSharedURL() {
  const parsedUrl = new URL(window.location);
  // searchParams.get() will properly handle decoding the values.
  if (!parsedUrl.searchParams.get("url")) return false;
  console.log("Title shared: " + parsedUrl.searchParams.get("title"));
  console.log("Text shared: " + parsedUrl.searchParams.get("text"));
  console.log("URL shared: " + parsedUrl.searchParams.get("url"));

  const { contentID, type } = sliceYoutubeURL(
    parsedUrl.searchParams.get("url")
  );

  return { type, contentID };
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

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
