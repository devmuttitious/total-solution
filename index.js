const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const subscriberRoutes = require("./routes/subscriberRoutes");
const mediaRoutes = require('./routes/mediaRoute');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require("./routes/careerRoutes");
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Serve static files from the 'uploads' and root directories
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use("/api", subscriberRoutes);
app.use("/api", mediaRoutes);
app.use("/api", contactRoutes);
app.use("/api/career", careerRoutes);

// Serve static HTML files dynamically without showing the '.html' extension
// Route for the root and subfolders (projects, services)
app.get('/:folder?/:page', (req, res) => {
    const { folder, page } = req.params;

    // If no folder specified, use the root folder
    const targetFolder = folder && (folder === 'projects' || folder === 'car-trade') ? folder : '';
    
    // Construct the file path dynamically based on the folder and page
    const filePath = targetFolder
        ? path.join(__dirname, '..', targetFolder, `${page}.html`)
        : path.join(__dirname, '..', `${page}.html`);

    // Check if the requested file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("Page not found");
    }
});

// Serve index/home page at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/index.html'));
});



// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
