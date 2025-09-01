/**
 * Multer configuration for file uploads
 * Handles DJ image uploads with validation and processing
 */

const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Configure multer storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

// Image processing function
const processImage = async (buffer, djId, originalName) => {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'dj-images');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate filename
    const ext = path.extname(originalName).toLowerCase();
    const filename = `${djId}${ext}`;
    const filepath = path.join(outputDir, filename);
    
    // Process image with Sharp
    await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(filepath);
    
    // Create thumbnail
    const thumbFilename = `${djId}_thumb.jpg`;
    const thumbFilepath = path.join(outputDir, thumbFilename);
    
    await sharp(buffer)
      .resize(150, 150, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbFilepath);
    
    return {
      filename: filename,
      filepath: filepath,
      thumbFilename: thumbFilename,
      thumbFilepath: thumbFilepath,
      webPath: `/dj-images/${filename}`,
      thumbWebPath: `/dj-images/${thumbFilename}`
    };
    
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

// Middleware for handling DJ image uploads
const uploadDjImage = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Get DJ ID from request
    const { djId } = req.body;
    if (!djId) {
      return res.status(400).json({
        success: false,
        message: 'DJ ID is required'
      });
    }
    
    // Process the image
    const imageInfo = await processImage(
      req.file.buffer,
      djId,
      req.file.originalname
    );
    
    // Add image info to request object
    req.imageInfo = imageInfo;
    
    next();
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};

// Middleware for handling multiple file uploads
const uploadMultipleImages = upload.array('images', 5);

// Middleware for handling single file upload
const uploadSingleImage = upload.single('image');

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Utility function to delete image files
const deleteImageFiles = async (djId) => {
  try {
    const outputDir = path.join(process.cwd(), 'public', 'dj-images');
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    for (const ext of extensions) {
      const filename = `${djId}${ext}`;
      const thumbFilename = `${djId}_thumb.jpg`;
      const filepath = path.join(outputDir, filename);
      const thumbFilepath = path.join(outputDir, thumbFilename);
      
      try {
        await fs.unlink(filepath);
      } catch (error) {
        // File doesn't exist, ignore
      }
      
      try {
        await fs.unlink(thumbFilepath);
      } catch (error) {
        // File doesn't exist, ignore
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image files:', error);
    return false;
  }
};

// Utility function to get image info
const getImageInfo = async (djId) => {
  try {
    const outputDir = path.join(process.cwd(), 'public', 'dj-images');
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    for (const ext of extensions) {
      const filename = `${djId}${ext}`;
      const thumbFilename = `${djId}_thumb.jpg`;
      const filepath = path.join(outputDir, filename);
      const thumbFilepath = path.join(outputDir, thumbFilename);
      
      try {
        const stats = await fs.stat(filepath);
        const thumbStats = await fs.stat(thumbFilepath);
        
        return {
          filename: filename,
          filepath: filepath,
          thumbFilename: thumbFilename,
          thumbFilepath: thumbFilepath,
          webPath: `/dj-images/${filename}`,
          thumbWebPath: `/dj-images/${thumbFilename}`,
          size: stats.size,
          thumbSize: thumbStats.size,
          exists: true
        };
      } catch (error) {
        // File doesn't exist, continue to next extension
        continue;
      }
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error getting image info:', error);
    return { exists: false };
  }
};

module.exports = {
  upload,
  uploadDjImage,
  uploadMultipleImages,
  uploadSingleImage,
  handleUploadError,
  processImage,
  deleteImageFiles,
  getImageInfo
};
