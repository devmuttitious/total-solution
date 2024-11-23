const Media = require("../models/mediaModel");

// Create a new media item
exports.createMedia = async (req, res) => {
  try {
    const { altText, date, title, description, learnMoreUrl } = req.body;
    const image = req.file.filename;

    const newMedia = new Media({
      image,
      altText,
      date,
      title,
      description,
      learnMoreUrl,
    });

    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all media items
// Get all media items with pagination
exports.getAllMedia = async (req, res) => {
    try {
      const { page = 1, limit = 6 } = req.query; // Default to page 1 and limit of 6
      const skip = (page - 1) * limit; // Calculate skip value for pagination
      
      // Fetch media items with pagination
      const mediaItems = await Media.find()
        .skip(skip)
        .limit(Number(limit)); // Convert limit to number
      
      res.status(200).json(mediaItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Delete a media item
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ message: "Media item not found" });
    }

    // Optionally, remove the image file from the server
    const fs = require("fs");
    fs.unlinkSync(`uploads/${media.image}`);

    await Media.findByIdAndDelete(id);
    res.status(200).json({ message: "Media item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    // Get the media ID from the query string
    const mediaId = req.query.id; // Use req.query.id for query parameters
    
    if (!mediaId) {
      return res.status(400).json({ message: 'Media ID is required' });
    }

    // Fetch the media from the database
    const media = await Media.findById(mediaId); // Assuming you're using a MongoDB model

    // If no media is found, return a 404 error
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Send back the media details as JSON
    res.json(media);
  } catch (error) {
    console.error('Error fetching media by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


