const Settings = require("../../models/Settings");
const Currency = require("../../models/Currencies");

// Get Full Settings
const getMainSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select(["main", "general", "branding"]);

    if (!settings) {
      settings = await Settings.findOne().select(["main"]);
    }
    const currency = await Currency.findOne({
      base: true,
    });

    res.status(200).json({
      success: true,
      data: {
        ...settings.main,
        baseCurrency: currency.code || "INR",
        cloudName: settings.general.cloudinary.cloudName,
        preset: settings.general.cloudinary.preset,
        favicon: settings.branding?.favicon,
        logoLight: settings.branding?.logoLight,
        logoDark: settings.branding?.logoDark,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};
const getBrandingSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select(["branding"]);

    if (!settings) {
      settings = await Settings.findOne().select(["branding"]);

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found even after initialization",
        });
      }
    }

    const { branding } = settings;

    res.status(200).json({
      success: true,
      data: branding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};
const getHomeSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select(["home"]);

    if (!settings) {
      settings = await Settings.findOne().select(["home"]);

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found even after initialization",
        });
      }
    }

    const { home } = settings;

    res.status(200).json({
      success: true,
      data: home,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};
const getGeneralSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select(["general"]);

    if (!settings) {
      settings = await Settings.findOne().select(["general"]);

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found even after initialization",
        });
      }
    }

    const { general, _id } = settings;

    res.status(200).json({
      success: true,
      data: { ...general, _id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

const getStripePublishableKey = async (req, res) => {
  try {
    const settings = await Settings.findOne().select(["general.stripe"]);
    
    if (!settings || !settings.general || !settings.general.stripe) {
      return res.status(404).json({
        success: false,
        message: "Stripe settings not found",
      });
    }

    const { publishableKey, isActive } = settings.general.stripe;

    if (!isActive) {
      return res.status(400).json({
        success: false,
        message: "Stripe is not active",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        publishableKey,
        isActive
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Stripe settings",
      error: error.message,
    });
  }
};

const testStripeConnection = async (req, res) => {
  try {
    const settings = await Settings.findOne().select(["general.stripe"]);
    
    if (!settings || !settings.general || !settings.general.stripe) {
      return res.status(404).json({
        success: false,
        message: "Stripe settings not found",
      });
    }

    const { publishableKey, secretKey, isActive, mode } = settings.general.stripe;

    // Test Stripe connection
    if (secretKey && secretKey !== 'STRIPE-SECRET-KEY-TEST-ABCDEF') {
      const Stripe = require('stripe');
      const stripe = new Stripe(secretKey);
      
      try {
        // Test the connection by listing payment methods
        await stripe.paymentMethods.list({ limit: 1 });
        
        res.status(200).json({
          success: true,
          message: "Stripe connection successful",
          data: {
            isActive,
            mode,
            publishableKey: publishableKey ? 'SET' : 'NOT SET',
            secretKey: secretKey ? 'SET' : 'NOT SET',
            connectionTest: 'PASSED'
          },
        });
      } catch (stripeError) {
        res.status(400).json({
          success: false,
          message: "Stripe connection failed",
          error: stripeError.message,
          data: {
            isActive,
            mode,
            publishableKey: publishableKey ? 'SET' : 'NOT SET',
            secretKey: secretKey ? 'SET' : 'NOT SET',
            connectionTest: 'FAILED'
          },
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Stripe secret key not configured or using default test key",
        data: {
          isActive,
          mode,
          publishableKey: publishableKey ? 'SET' : 'NOT SET',
          secretKey: secretKey ? 'SET' : 'NOT SET',
          connectionTest: 'SKIPPED - Using default test key'
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to test Stripe connection",
      error: error.message,
    });
  }
};

module.exports = {
  getMainSettings,
  getBrandingSettings,
  getHomeSettings,
  getGeneralSettings,
  getStripePublishableKey,
  testStripeConnection
};
