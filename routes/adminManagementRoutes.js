import express from 'express';
import { getAdmins, addAdmin, updateAdminRole, deleteAdmin } from '../controllers/adminManagementController.js';

const router = express.Router();

router.get('/', getAdmins);
router.post('/', addAdmin);
router.put('/:id', updateAdminRole);
router.delete('/:id', deleteAdmin);

export default router;
