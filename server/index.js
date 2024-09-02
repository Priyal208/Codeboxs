const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require('./routes/profileRoutes');
const contactRoutes = require('./routes/contactRoutes');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 4000;
database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
);

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach",contactRoutes);

app.post('/upload', async (req, res) => {
    try {
      console.log('Received files:', req.files);
  
      // Use the correct key for accessing the file
      const file = req.files.thumbnailImage;
      
      if (!file || !file.tempFilePath) {
        console.error('File or tempFilePath is missing:', file);
        return res.status(400).send('File or tempFilePath is missing');
      }
  
      const folder = "priyal";
      const height = 500; // Optional
      const quality = "auto"; // Optional
  
      const result = await uploadImageToCloudinary(file, folder, height, quality);
  
      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
  


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running.."
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
