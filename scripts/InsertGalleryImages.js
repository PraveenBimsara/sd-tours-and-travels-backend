const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gallery Model
const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);

// Function to insert images from uploads/gallery folder
async function insertGalleryImages() {
  try {
    const galleryPath = path.join(__dirname, '../uploads/gallery');
    
    // Check if directory exists
    if (!fs.existsSync(galleryPath)) {
      console.log('Gallery folder does not exist. Creating...');
      fs.mkdirSync(galleryPath, { recursive: true });
      console.log('Gallery folder created at:', galleryPath);
      console.log('\nPlease copy your 80 images to:', galleryPath);
      console.log('Then run this script again.');
      process.exit(0);
    }

    // Read all files from gallery folder
    const files = fs.readdirSync(galleryPath);
    
    // Filter only image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('No images found in:', galleryPath);
      console.log('\nPlease copy your images to this folder and run again.');
      process.exit(0);
    }

    console.log(`Found ${imageFiles.length} images`);
    console.log('Inserting into database...\n');

    // Clear existing gallery (optional - comment out if you want to keep existing)
    // await Gallery.deleteMany({});
    // console.log('Cleared existing gallery images');

    // Create gallery entries
    const galleryEntries = imageFiles.map((file, index) => ({
      imageUrl: `/uploads/gallery/${file}`,
      caption: '', // You can manually add captions later through admin panel
      displayOrder: index + 1
    }));

    // Insert into database
    const result = await Gallery.insertMany(galleryEntries);
    
    console.log(`✅ Successfully inserted ${result.length} images into gallery!`);
    console.log('\nImages inserted:');
    result.forEach((img, i) => {
      console.log(`${i + 1}. ${img.imageUrl}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
insertGalleryImages();