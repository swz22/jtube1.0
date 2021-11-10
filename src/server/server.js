
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var cors = require("cors");
var fileExtension = require("file-extension");

const app = express();
app.use(cors());

app.listen(3000, () => console.log("Server started on port 3000"));

// Configure Storage
var storage = multer.diskStorage({
  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, "my_uploaded_files");
  },
  // Setting name of file saved
  filename: function (req, file, cb) {
    const counter = fs.readdirSync("./my_uploaded_files/").length+1 // gives back an array
    cb(null, counter + "." + fileExtension(file.originalname));
  },
});

var upload = multer({
  storage: storage,
  limits: {
    // Setting Image Size Limit to 900MBs
    fileSize: 900000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|m4v)$/)) {
      //Error
      cb(new Error("Please upload JPG, PNG, or MP4 images only!"));
    }
    //Success
    cb(undefined, true);
  },
});

app.post(
  "/uploadfile",
  upload.single("uploadedMedia"),
  (req, res, next) => {
    const file = req.file;
    console.log(req);
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.status(200).send({
      statusCode: 200,
      status: "success",
      uploadedFile: file,
    });
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

app.get("/video/:id", function (req, res) {
  const path = `./my_uploaded_files/${req.params.id}`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.get("/uploadedvideos", function (req, res) {
  const videolist = fs.readdirSync('./my_uploaded_files/');
  res.json(videolist)
})
