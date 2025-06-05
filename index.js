const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const allFileMimeTypes = {
  // Documents
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".rtf": "application/rtf",
  ".odt": "application/vnd.oasis.opendocument.text",

  // Images
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",

  // Audio
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".aac": "audio/aac",
  ".flac": "audio/flac",

  // Video
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",

  // Archives
  ".zip": "application/zip",
  ".rar": "application/vnd.rar",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".7z": "application/x-7z-compressed"
};

app.get("/api/file-url-to-base64/convert", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Missing file URL!" });
    }

    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");

    let contentType = "application/octet-stream";
    try {
      const extension = path.extname(new URL(url).pathname).toLowerCase();
      contentType = allFileMimeTypes[extension] || "application/octet-stream";
    } catch (error) { }

    res.status(200).json({ base64: `data:${contentType};base64,${base64}` });
  } catch (error) {
    const parsedError = error?.response?.data?.error?.message || error?.response?.data?.error || error?.response?.data || error?.message || error;
    console.log("#### parsedError --->", parsedError);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(3001, function () {
  console.log("#### => Server listening on 3001.");
});
