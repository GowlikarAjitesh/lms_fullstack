const express = require("express");
const multer = require("multer");

const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../helpers/cloudinary");
const { route } = require("./auth-routes");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // console.log("req.file:", req.file);
    const { publicId } = req.body;
    // console.log("from upload/ replace  instructor-route = ", publicId);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }
    const result = await uploadMediaToCloudinary(req.file.path, publicId);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Upload Failed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Media Upload Successful",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Uploading File",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("from delete instructor - routes = ", id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No Media Found",
      });
    }
    const result = await deleteMediaFromCloudinary(id);
    // console.log(result);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Cannot Delete Media",
      });
    }
    res.status(200).json({
      success: true,
      message: "Media Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Something went wrong",
    });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    // console.log("req.bulk files:", req.files);
    const { publicId } = req.body;
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No files received",
      });
    }
    const bulkFiles = req.files;
    const uploadedPromises = bulkFiles.map((fileItem, index) => uploadMediaToCloudinary(fileItem.path, publicId) )
    const result = await Promise.all(uploadedPromises);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Bulk Upload Failed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bulk Upload Successful",
      data: result
    });
  } catch (error) {
    console.log("erroor = ", error);
    res.status(500).json({
      success: false,
      message: "Error Uploading Files",
    });
  }
});

module.exports = router;
