// imports
import axios from "axios";

// configure defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
if (!axios.defaults.baseURL) {
  throw new Error("API Url is required");
}
console.log(process.env.REACT_APP_API_URL);

// Function to fetch video information from server
const fetchVideoInfo = (videoId) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/video-info", {
        params: {
          id: videoId,
        },
      })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

// Function to download video/audio
const download = ({ title, videoId, format = "mp4" }) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/download", {
        params: {
          id: videoId,
          format: format,
        },
        responseType: "blob",
      })
      .then((response) => {
        // Create a URL for the file and download it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.${format}`); // Specify the file name and format
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
        // download completed
        resolve();
      })
      .catch((err) => reject(err));
  });
};

// Function to retrieve video id from url
const extractVideoId = (url) => {
  const regex =
  // eslint-disable-next-line
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// export
export { fetchVideoInfo, extractVideoId, download };
