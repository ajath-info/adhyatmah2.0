const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../src/models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    // update all users to set status to active
    const result = await User.updateMany({}, { $set: { status: "active" } });
    console.log(`🎉 Updated ${result.nModified} users to set status to active`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("🔥 Error:", err);
    process.exit(1);
  }
})();
