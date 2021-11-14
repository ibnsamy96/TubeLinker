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
  const urlArr = location.href.split("?");
  if (urlArr[1]) {
    contentID = urlArr[1].split("=")[1];
    contentIDElement.value = contentID;
    showContent(contentID);
  }
});
