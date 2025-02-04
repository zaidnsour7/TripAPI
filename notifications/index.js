var admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join("../", process.env.PUSH_NOTIFICATION_KEY));

const firebseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


async function sendPushNotification(devicePushToken, title, body){
  await firebseAdmin.messaging().send({
    token : devicePushToken,
    notification : {
      title,
      body,
    }
  })
}

async function updateDeviceToken(req, res) {
  const { userId, devicePushToken } = req.body;

  if (!userId || !devicePushToken) {
    return res.status(400).json({ message: "Missing userId or devicePushToken" });
  }

  try {
    await User.update({ devicePushToken }, { where: { id: userId } });
    res.status(200).json({ message: "Device token updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while update the Device token", error: err.message });
  }
}



module.exports = {sendPushNotification, updateDeviceToken}