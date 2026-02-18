import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

/*
--------------------------------
GET ALL CATEGORIES
--------------------------------
*/
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let filter = { isDeleted: false };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

/*
--------------------------------
ADD CATEGORY
--------------------------------
*/
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const existing = await Category.findOne({
      slug,
      isDeleted: false,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
});

/*
--------------------------------
GET SINGLE CATEGORY
--------------------------------
*/
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
});

/*
--------------------------------
UPDATE CATEGORY
--------------------------------
*/
router.put('/:id', async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const existing = await Category.findOne({
      slug,
      _id: { $ne: req.params.id },
      isDeleted: false,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Another category with this name already exists',
      });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, { name, slug, description, isActive }, { new: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
    });
  }
});

/*
--------------------------------
DELETE CATEGORY (SOFT DELETE)
--------------------------------
*/
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
});

export default router;
