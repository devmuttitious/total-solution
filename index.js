const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const subscriberRoutes = require("./routes/subscriberRoutes");
const mediaRoutes = require("./routes/mediaRoute");
const contactRoutes = require("./routes/contactRoutes");
const careerRoutes = require("./routes/careerRoutes");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Serve static files from the 'uploads' and root directories
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use(express.static(path.resolve(__dirname, "..")));

// API Routes
app.use("/api", subscriberRoutes);
app.use("/api", mediaRoutes);
app.use("/api", contactRoutes);
app.use("/api/career", careerRoutes);

// Serve static HTML files dynamically without showing the '.html' extension
app.get("/:folder?/:page", (req, res) => {
  const { folder, page } = req.params;

  // Check if folder is valid and construct the target folder path
  const targetFolder =
    folder && (folder === "projects" || folder === "car-trade") ? folder : "";

  // Construct the file path dynamically based on the folder and page
  const filePath = targetFolder
    ? path.resolve(__dirname, "..", targetFolder, `${page}.html`)
    : path.resolve(__dirname, "..", `${page}.html`);

  // Check if the requested file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send("Page not found");
  }
});

// Serve index/home page at the root
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "index.html"));
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
