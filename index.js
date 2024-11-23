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
app.use(cors({
    origin: ["https://tst.com.sa", "http://localhost:3000", "https://total-solution.vercel.app",], // Add localhost for testing
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Hey i updated

// Database Connection
connectDB();

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..")));

// API Routes
app.use("/api", subscriberRoutes);
app.use("/api", mediaRoutes);
app.use("/api", contactRoutes);
app.use("/api/career", careerRoutes);

// Serve dynamic static HTML files
app.get("/:folder?/:page", (req, res) => {
    const { folder, page } = req.params;
    const targetFolder = folder && (folder === "projects" || folder === "car-trade") ? folder : "";
    const filePath = targetFolder
        ? path.join(__dirname, "..", targetFolder, `${page}.html`)
        : path.join(__dirname, "..", `${page}.html`);

    console.log("Requested file:", filePath); // Debugging log

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error("File not found:", filePath); // Debugging log
        res.status(404).send("Page not found");
    }
});

// Root route to show API status
app.get("/", (req, res) => {
    res.send("Your API is working");
});

// Start the Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Accessible at https://tst.com.sa`);
});
