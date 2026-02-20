import express from 'express';
import {
  getGeneralSettings,
  updateGeneralSettings,
  getCommissionSettings,
  updateCommissionSettings,
  getPlatformRules,
  updatePlatformRules,
  getEmailTemplates,
  updateEmailTemplates,
  getFeatureToggles,
  updateFeatureToggles,
} from '../controllers/settingsController.js';

const router = express.Router();

// GET General Settings
router.get('/general', getGeneralSettings);

// UPDATE General Settings
router.put('/general', updateGeneralSettings);

// GET Commission Settings
router.get('/commission', getCommissionSettings);

// UPDATE Commission Settings
router.put('/commission', updateCommissionSettings);

// GET Platform Rules
router.get('/rules', getPlatformRules);

// UPDATE Platform Rules
router.put('/rules', updatePlatformRules);

// GET Email Templates
router.get('/emails', getEmailTemplates);

// UPDATE Email Templates
router.put('/emails', updateEmailTemplates);

// GET Feature Toggles
router.get('/features', getFeatureToggles);

// UPDATE Feature Toggles
router.put('/features', updateFeatureToggles);

export default router;
