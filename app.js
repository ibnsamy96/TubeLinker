const production = false;
let backendURL = production
  ? "http://127.0.0.1:8000"
  : "https://ynsfab.deta.dev";

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
  if (document.querySelector("#download"))
    document.querySelector("#download").style.display = "none";

  contentID = value || contentIDElement.value;
  contentType = type || contentTypeElement.value;
  console.log(contentType);

  if (contentType === "video")
    document.querySelector("#player").innerHTML = addVideoIframe(contentID);
  else if (contentType === "playlist")
    document.querySelector("#player").innerHTML = addPlaylistIframe(contentID);

  getDownloadData((type = contentType), (id = contentID))
    .then(extractDownloadData)
    .then(appendDownloadData)
    .then(() => {
      document.querySelector("#download").style.display = "block";
    });
}

window.addEventListener("load", () => {
  const queryParams = extractQueryParams(location.href);
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
  const url = `${backendURL}/${type}?id=${id}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
}

function extractDownloadData(jsonData) {
  console.log(jsonData.formats[0]);
  const linksArray = [];
  jsonData.quality.forEach((value) => {
    value = value.split("");
    value.pop();
    value = value.join("");
    const downloadData = jsonData.formats[0].find(
      (format) => String(format.height) === String(value)
    );
    linksArray.push({
      quality: value,
      url: downloadData.url,
      title: jsonData.title,
    });
  });
  return linksArray;
}

const downloadingQualitiesList = document.querySelector("#qualities");
function appendDownloadData(linksArray) {
  linksArray.forEach((linkObject) => {
    const newAnchor = document.createElement("a");
    newAnchor.innerText = linkObject.quality + "p";
    newAnchor.setAttribute("href", linkObject.url);
    newAnchor.setAttribute("download", linkObject.title);
    // newAnchor.addEventListener("click", (e) => {
    //   e.preventDefault();
    // });
    downloadingQualitiesList.appendChild(newAnchor);
  });
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
