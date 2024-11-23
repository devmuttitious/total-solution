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
// Enable CORS with specific origin (set to your domain)
app.use(cors({
    origin: "https://tst.com.sa", // Allow requests only from this domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow cookies if needed
}));

app.use(express.json());

// Database Connection
connectDB();

// Serve static files from the 'uploads' and root directories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..")));

// API Routes
app.use("/api", subscriberRoutes);
app.use("/api", mediaRoutes);
app.use("/api", contactRoutes);
app.use("/api/career", careerRoutes);

// Serve static HTML files dynamically without showing the '.html' extension
app.get("/:folder?/:page", (req, res) => {
    const { folder, page } = req.params;

    // Allow serving files from 'projects' or 'car-trade' folders
    const targetFolder = folder && (folder === "projects" || folder === "car-trade") ? folder : "";

    // Construct the file path dynamically
    const filePath = targetFolder
        ? path.join(__dirname, "..", targetFolder, `${page}.html`)
        : path.join(__dirname, "..", `${page}.html`);

    // Check if the file exists and serve it
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Page not found");
    }
});

// Serve index/home page at the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running and accessible at https://tst.com.sa (Port: ${PORT})`);
});
