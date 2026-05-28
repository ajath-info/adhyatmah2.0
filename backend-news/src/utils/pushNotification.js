const admin = require("firebase-admin");
const path = require("path");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.join(
        __dirname,
        "../../config/adhyatmah-c00f7-firebase-adminsdk-fbsvc-3d691d4311.json"
      ))
    ),
  });
}

const sendPush = async ({ token, title, body, data = {} }) => {
  try {
    if (!token) return;

    const message = {
      token,
      notification: { title, body },
      data,
      android: { priority: "high" },
      apns: {
        payload: { aps: { sound: "default" } },
      },
    };

    return await admin.messaging().send(message);
  } catch (error) {
    console.error("Push Error:", error.message);

    // Remove invalid token automatically
    if (error.code === "messaging/registration-token-not-registered") {
      console.log("Invalid token detected");
    }
  }
};

const sendPushToMany = async ({ tokens, title, body, data = {} }) => {
  try {
    if (!tokens?.length) return;

    const message = {
      tokens,
      notification: { title, body },
      data,
    };

    return await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    console.error("Multicast Push Error:", error.message);
  }
};

module.exports = { sendPush, sendPushToMany };