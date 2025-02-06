const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join("../", process.env.PUSH_NOTIFICATION_KEY));

const firebseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


async function handlePushNotification(state, devicePushToken){

  const states = {
    accepted:{
      title:"Trip Accepted!",
      body:"Your Trip is accepted please wait your driver arrive."
    },
    arrived:{
      title:"Your rider is arrived!",
      body:"Your rider is arrived and wait you."
    },
    started:{
      title:"Trip Started!",
      body:"Wish you safe trip."
    },
    completed:{
      title:"Trip completed!",
      body:"Your trip was completed wish see you seen."
    },
    no_driver_found:{
      title:"There is no driver available!",
      body:"There is no driver available near you."
    },
    canceled:{
      title:"Trip cancellation!",
      body:"Trip was cancelled due to user request."
    },
  }

  const {title, body} = states[state] ;

  sendPushNotification(devicePushToken, title, body);
  
}


async function sendPushNotification(devicePushToken, title, body){
  await firebseAdmin.messaging().send({
    token : devicePushToken,
    notification : {
      title,
      body,
    }
  })
}
/*
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
*/


module.exports = {handlePushNotification}