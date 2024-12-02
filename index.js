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
const bodyParser = require("body-parser");

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
// Middleware
app.use(bodyParser.json({ limit: "20mb" })); // Handle large Base64 strings
app.use(bodyParser.urlencoded({ extended: true }));

// Hey i updated

// Database Connection
connectDB();
// Serve static files from the project root (e.g., index.html, global assets)
app.use(express.static(path.join(__dirname, '../')));

// Serve JavaScript files and plugins
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/js/plugins', express.static(path.join(__dirname, '../js/plugins')));

// Serve CSS files and plugins
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/css/plugins', express.static(path.join(__dirname, '../css/plugins')));
app.use('/scss', express.static(path.join(__dirname, '../scss')));


// Serve image files
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/videos', express.static(path.join(__dirname, '../videos')));


// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve car-trade and projects folders
app.use('/car-trade', express.static(path.join(__dirname, '../car-trade')));
app.use('/projects', express.static(path.join(__dirname, '../projects')));

// Social media redirection routes
app.get('/social/facebook', (req, res) => {
    res.redirect('https://web.facebook.com/tst.601?mibextid=ZbWKwL&_rdc=1&_rdr');
});

app.get('/social/twitter', (req, res) => {
    res.redirect('https://x.com/search?q=tst_601&t=hSTqqeMPt4IvJZApqT93RA&s=09');
});

app.get('/social/instagram', (req, res) => {
    res.redirect('https://www.instagram.com/tst.601/?igshid=YmMyMTA2M2Y');
});

app.get('/social/whatsapp', (req, res) => {
    res.redirect('https://api.whatsapp.com/send/?phone=966598301301&text&type=phone_number&app_absent=0');
});

app.get('/social/snapchat', (req, res) => {
    res.redirect('https://www.snapchat.com/add/tst.601');
});

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
