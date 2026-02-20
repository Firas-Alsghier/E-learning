import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    general: {
      platformName: {
        type: String,
        default: 'My Platform',
      },
      logoUrl: {
        type: String,
        default: '',
      },
      contactEmail: {
        type: String,
        default: '',
      },
      supportPhone: {
        type: String,
        default: '',
      },
      defaultCurrency: {
        type: String,
        default: 'USD',
      },
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
    },

    commission: {
      globalRate: {
        type: Number,
        default: 20, // 20%
      },
      instructorOverrideAllowed: {
        type: Boolean,
        default: false,
      },
      minimumPayout: {
        type: Number,
        default: 50,
      },
    },

    rules: {
      terms: {
        type: String,
        default: '',
      },
      privacy: {
        type: String,
        default: '',
      },
      requireAcceptanceOnSignup: {
        type: Boolean,
        default: true,
      },
    },

    emailTemplates: {
      welcomeEmail: {
        type: String,
        default: '',
      },
      passwordReset: {
        type: String,
        default: '',
      },
      purchaseConfirmation: {
        type: String,
        default: '',
      },
      instructorApproval: {
        type: String,
        default: '',
      },
    },

    features: {
      instructorRegistration: {
        type: Boolean,
        default: true,
      },
      coupons: {
        type: Boolean,
        default: true,
      },
      liveClasses: {
        type: Boolean,
        default: false,
      },
      reviews: {
        type: Boolean,
        default: true,
      },
      certificates: {
        type: Boolean,
        default: false,
      },
      referralSystem: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// 👇 Ensure only ONE document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({});
  }

  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
