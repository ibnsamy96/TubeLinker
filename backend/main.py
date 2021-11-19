from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import requests


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "https://myyp.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fetchData(url: str):
    r = requests.get(url)
    jsonData = r.json()
    return jsonData


def filterUnneededFormats(formats: list):
    goodFormats = []

    for format in formats:
        if format["ext"] == "mp4":
            goodFormats.append(format)

    return goodFormats


def formatVideoData(rowData: object):
    returnedData = {
        "url": rowData["url"],
        "quality": rowData["quality"],
        "title": rowData["title"],
        "description": rowData["description"],
        "thumbnails": rowData["thumbnails"],
    }

    try:
        returnedData["formats"] = (filterUnneededFormats(rowData["format"]),)

    except:
        print("Error happened with video -> " + rowData["title"])
        returnedData["formats"] = (rowData["format"],)

    return returnedData


def formatPlaylistData(rowData: object):
    items = []
    for item in rowData["items"]:
        items.append(getVideo(item["id"]))

    downloadLinks = {}
    for item in items:
        try:
            for format in item["formats"]:
                if format["height"] in downloadLinks:
                    downloadLinks[format["height"]].append(format["url"])
                else:
                    downloadLinks[format["height"]] = [format["url"]]
        except:
            for format in item["formats"][0]:
                if format["height"] in downloadLinks:
                    downloadLinks[format["height"]].append(format["url"])
                else:
                    downloadLinks[format["height"]] = [format["url"]]

    return {
        "totalResults": rowData["totalResults"],
        "downloadLinks": downloadLinks,
        "playlistVideos": items,
    }


def getURL(id: str, type: str, nextPageToken: str = ""):
    if type == "video":
        return f"https://api.youtubemultidownloader.com/video?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D{id}"
    if type == "playlist":
        return f"https://api.youtubemultidownloader.com/playlist?url=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3D{id}&nextPageToken={nextPageToken}"


@app.get("/video")
def getVideo(
    id: str = Query(
        ...,
        description="The ID of the video.",
    )
):
    videoURL = getURL(id, type="video")
    rowData = fetchData(videoURL)
    return formatVideoData(rowData)


@app.get("/playlist")
def getPlaylist(
    id: str = Query(
        ...,
        description="The ID of the playlist.",
    ),
    nextPageToken: Optional[str] = Query(
        "",
        description="The ID of the playlist.",
    ),
):
    playlistURL = getURL(id, type="playlist", nextPageToken=nextPageToken)
    rowData = fetchData(playlistURL)
    return formatPlaylistData(rowData)
