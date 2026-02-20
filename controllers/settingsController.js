import Settings from '../models/Settings.js';

/**
 * GET General Settings
 */
export const getGeneralSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json(settings.general);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch general settings' });
  }
};

/**
 * UPDATE General Settings
 */
export const updateGeneralSettings = async (req, res) => {
  try {
    const { platformName, logoUrl, contactEmail, supportPhone, defaultCurrency, maintenanceMode } = req.body;

    const settings = await Settings.getSettings();

    settings.general = {
      platformName,
      logoUrl,
      contactEmail,
      supportPhone,
      defaultCurrency,
      maintenanceMode,
    };

    await settings.save();

    res.status(200).json({
      message: 'General settings updated successfully',
      general: settings.general,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update general settings' });
  }
};

/*
--------------------------------
GET COMMISSION SETTINGS
--------------------------------
*/
export const getCommissionSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json(settings.commission);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch commission settings',
    });
  }
};

/*
--------------------------------
UPDATE COMMISSION SETTINGS
--------------------------------
*/
export const updateCommissionSettings = async (req, res) => {
  try {
    const { globalRate, instructorOverrideAllowed, minimumPayout } = req.body;

    const settings = await Settings.getSettings();

    settings.commission = {
      globalRate,
      instructorOverrideAllowed,
      minimumPayout,
    };

    await settings.save();

    res.status(200).json({
      message: 'Commission settings updated successfully',
      commission: settings.commission,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update commission settings',
    });
  }
};

/*
--------------------------------
GET PLATFORM RULES
--------------------------------
*/
export const getPlatformRules = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json(settings.rules);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch platform rules',
    });
  }
};

/*
--------------------------------
UPDATE PLATFORM RULES
--------------------------------
*/
export const updatePlatformRules = async (req, res) => {
  try {
    const { terms, privacy, requireAcceptanceOnSignup } = req.body;

    const settings = await Settings.getSettings();

    settings.rules = {
      terms,
      privacy,
      requireAcceptanceOnSignup,
    };

    await settings.save();

    res.status(200).json({
      message: 'Platform rules updated successfully',
      rules: settings.rules,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update platform rules',
    });
  }
};

/*
--------------------------------
GET EMAIL TEMPLATES
--------------------------------
*/
export const getEmailTemplates = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json(settings.emailTemplates);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch email templates',
    });
  }
};

/*
--------------------------------
UPDATE EMAIL TEMPLATES
--------------------------------
*/
export const updateEmailTemplates = async (req, res) => {
  try {
    const { welcomeEmail, passwordReset, purchaseConfirmation, instructorApproval } = req.body;

    const settings = await Settings.getSettings();

    settings.emailTemplates = {
      welcomeEmail,
      passwordReset,
      purchaseConfirmation,
      instructorApproval,
    };

    await settings.save();

    res.status(200).json({
      message: 'Email templates updated successfully',
      emailTemplates: settings.emailTemplates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update email templates',
    });
  }
};

/*
--------------------------------
GET FEATURE TOGGLES
--------------------------------
*/
export const getFeatureToggles = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json(settings.features);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch feature toggles',
    });
  }
};

/*
--------------------------------
UPDATE FEATURE TOGGLES
--------------------------------
*/
export const updateFeatureToggles = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    settings.features = req.body;

    await settings.save();

    res.status(200).json({
      message: 'Feature toggles updated successfully',
      features: settings.features,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update feature toggles',
    });
  }
};
