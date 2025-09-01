/**
 * Admin routes for TML Collect
 * Handles admin-specific operations like DJ image uploads
 */

const express = require('express');
const router = express.Router();
const { uploadSingleImage, uploadDjImage, deleteImageFiles, getImageInfo } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// Mock database connection (replace with actual database)
const db = require('../models/database');

// Admin authentication middleware (simplified)
const requireAdmin = (req, res, next) => {
  // In a real app, this would verify JWT token and check admin role
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required'
    });
  }
  
  // Mock admin check
  const token = authHeader.split(' ')[1];
  if (token !== 'admin-token') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    });
  }
  
  next();
};

// Validation middleware
const validateDjImageUpload = [
  body('djId')
    .notEmpty()
    .withMessage('DJ ID is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('DJ ID must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

/**
 * POST /api/admin/upload-dj-image
 * Upload a new image for a DJ
 */
router.post('/upload-dj-image', 
  requireAdmin,
  uploadSingleImage,
  uploadDjImage,
  validateDjImageUpload,
  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { djId, description } = req.body;
      const imageInfo = req.imageInfo;
      
      // Check if DJ exists
      const dj = await db.query('SELECT * FROM djs WHERE id = $1', [djId]);
      if (dj.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'DJ not found'
        });
      }
      
      // Update DJ record with new image URL
      const updateQuery = `
        UPDATE djs 
        SET image_url = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
        RETURNING *
      `;
      
      const updatedDj = await db.query(updateQuery, [imageInfo.webPath, djId]);
      
      // Log the upload in admin_uploads table
      const logQuery = `
        INSERT INTO admin_uploads (admin_id, dj_id, original_filename, file_path, file_size, mime_type, upload_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      await db.query(logQuery, [
        '00000000-0000-0000-0000-000000000001', // Mock admin ID
        djId,
        req.file.originalname,
        imageInfo.filepath,
        req.file.size,
        req.file.mimetype,
        'completed'
      ]);
      
      res.json({
        success: true,
        message: 'DJ image uploaded successfully',
        data: {
          dj: updatedDj.rows[0],
          image: {
            filename: imageInfo.filename,
            webPath: imageInfo.webPath,
            thumbWebPath: imageInfo.thumbWebPath,
            size: req.file.size
          }
        }
      });
      
    } catch (error) {
      console.error('Error uploading DJ image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload DJ image',
        error: error.message
      });
    }
  }
);

/**
 * DELETE /api/admin/dj-image/:djId
 * Delete a DJ's image
 */
router.delete('/dj-image/:djId', requireAdmin, async (req, res) => {
  try {
    const { djId } = req.params;
    
    // Check if DJ exists
    const dj = await db.query('SELECT * FROM djs WHERE id = $1', [djId]);
    if (dj.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'DJ not found'
      });
    }
    
    // Delete image files
    const deleted = await deleteImageFiles(djId);
    
    // Update DJ record to remove image URL
    const updateQuery = `
      UPDATE djs 
      SET image_url = NULL, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    
    const updatedDj = await db.query(updateQuery, [djId]);
    
    res.json({
      success: true,
      message: 'DJ image deleted successfully',
      data: {
        dj: updatedDj.rows[0],
        filesDeleted: deleted
      }
    });
    
  } catch (error) {
    console.error('Error deleting DJ image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete DJ image',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/dj-image/:djId
 * Get DJ image information
 */
router.get('/dj-image/:djId', requireAdmin, async (req, res) => {
  try {
    const { djId } = req.params;
    
    // Check if DJ exists
    const dj = await db.query('SELECT * FROM djs WHERE id = $1', [djId]);
    if (dj.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'DJ not found'
      });
    }
    
    // Get image info
    const imageInfo = await getImageInfo(djId);
    
    res.json({
      success: true,
      data: {
        dj: dj.rows[0],
        image: imageInfo
      }
    });
    
  } catch (error) {
    console.error('Error getting DJ image info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get DJ image info',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/upload-logs
 * Get admin upload logs
 */
router.get('/upload-logs', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT 
        au.*,
        d.stage_name as dj_name,
        u.username as admin_name
      FROM admin_uploads au
      LEFT JOIN djs d ON au.dj_id = d.id
      LEFT JOIN users u ON au.admin_id = u.id
      ORDER BY au.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const logs = await db.query(query, [limit, offset]);
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM admin_uploads';
    const countResult = await db.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      data: {
        logs: logs.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Error getting upload logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload logs',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/update-dj-rarity
 * Update DJ rarity (admin only)
 */
router.post('/update-dj-rarity', 
  requireAdmin,
  [
    body('djId').notEmpty().withMessage('DJ ID is required'),
    body('rarity').isIn(['COMMON', 'RARE', 'EPIC', 'LEGENDARY']).withMessage('Invalid rarity level')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { djId, rarity, reason } = req.body;
      
      // Check if DJ exists
      const dj = await db.query('SELECT * FROM djs WHERE id = $1', [djId]);
      if (dj.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'DJ not found'
        });
      }
      
      // Update DJ rarity
      const updateQuery = `
        UPDATE djs 
        SET rarity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
        RETURNING *
      `;
      
      const updatedDj = await db.query(updateQuery, [rarity, djId]);
      
      res.json({
        success: true,
        message: 'DJ rarity updated successfully',
        data: {
          dj: updatedDj.rows[0],
          reason: reason || 'Admin update'
        }
      });
      
    } catch (error) {
      console.error('Error updating DJ rarity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update DJ rarity',
        error: error.message
      });
    }
  }
);

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Get various statistics
    const stats = await Promise.all([
      db.query('SELECT COUNT(*) FROM djs'),
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM user_cards'),
      db.query('SELECT COUNT(*) FROM events'),
      db.query('SELECT rarity, COUNT(*) FROM djs GROUP BY rarity'),
      db.query('SELECT COUNT(*) FROM admin_uploads WHERE upload_status = $1', ['completed'])
    ]);
    
    const [
      djCount,
      userCount,
      cardCount,
      eventCount,
      rarityStats,
      uploadCount
    ] = stats;
    
    res.json({
      success: true,
      data: {
        totalDjs: parseInt(djCount.rows[0].count),
        totalUsers: parseInt(userCount.rows[0].count),
        totalCards: parseInt(cardCount.rows[0].count),
        totalEvents: parseInt(eventCount.rows[0].count),
        totalUploads: parseInt(uploadCount.rows[0].count),
        rarityDistribution: rarityStats.rows.reduce((acc, row) => {
          acc[row.rarity] = parseInt(row.count);
          return acc;
        }, {})
      }
    });
    
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin statistics',
      error: error.message
    });
  }
});

module.exports = router;
