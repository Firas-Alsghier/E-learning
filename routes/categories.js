import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

/**
 * GET ALL CATEGORIES (PUBLIC)
 * GET /api/categories
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

export default router;
