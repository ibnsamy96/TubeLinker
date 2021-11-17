const playlistCode = (listID) => {
  // src="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY"
  return `<iframe width="750" height="450" src="https://www.youtube.com/embed?listType=playlist&list=${listID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

const videoCode = (videoID) => {
  // src="https://www.youtube.com/embed/tgbNymZ7vqY"
  return `<iframe width="750" height="450" src="https://www.youtube.com/embed/${videoID}?rel=0" frameborder="0" allow="autoplay; picture-in-picture" allowfullscreen></iframe>`;
};

let contentIDElement = document.querySelector("#contentID");
// let contentType;

function showContent(value = null) {
  contentID = value || contentIDElement.value;
  //   contentType = document.querySelector('input[name="contentType"]:checked')
  //     .value;

  //   if (contentType === "video") {
  document.querySelector("#content").innerHTML = videoCode(contentID);
  //   } else {
  //     document.querySelector("#content").innerHTML = playlistCode(contentID);
  //   }
}

window.addEventListener("load", () => {
  // const urlArr = location.href.split("?");
  // if (urlArr[1]) {
  //   contentID = urlArr[1].split("=")[1];
  //   contentIDElement.value = contentID;
  //   showContent(contentID);
  // }
  const queryParams = extractQueryParams(location.href);
  if (Object.keys(queryParams).includes("video")) {
    const videoID = queryParams.video;
    contentIDElement.value = videoID;
    showContent(videoID);
  }
  if (Object.keys(queryParams).includes("playlist")) {
    // TODO grab its data and show its fist video
  }
});

function extractQueryParams(url) {
  const queries = url.split("?").splice(0, 1);
  if (queries.length === 0 || !queries[0]) return;
  // const queryParams = queries.map((query) => {
  //   const tempQueryArr = query.split("=");
  //   return { [tempQueryArr[0]] : tempQueryArr[1] };
  // });
  const queryParams = queries.reduce((acc, query) => {
    const tempQueryArr = query.split("=");
    acc[tempQueryArr[0]] = tempQueryArr[1];
    return acc;
  }, {});

  console.log(queryParams);
  return queryParams;
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
