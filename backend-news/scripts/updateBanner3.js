const mongoose = require("mongoose");
require("dotenv").config();

const Settings = require("../src/models/Settings");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const settings = await Settings.findOne();

    if (!settings) {
      console.log("❌ No settings document found");
      process.exit(0);
    }

    if (!settings.home || !settings.home.banner2) {
      console.log("❌ banner2 not found");
      process.exit(0);
    }

    settings.home.banner3 = {
      image: {
        _id: settings.home.banner2.image._id,
        url: settings.home.banner2.image.url,
      },
      link: settings.home.banner2.link,
    };

    await settings.save();

    console.log("🎉 banner3 updated successfully");
    console.log(JSON.stringify(settings.home.banner3, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("🔥 Error:", err);
    process.exit(1);
  }
})();
