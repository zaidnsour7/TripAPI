const {sendPushNotification} = require("./index");
const admin =require("firebase-admin") ;
const db = admin.firestore();
 
 
async function notifyDriverWithTripCancellation(devicePushToken){
  try{

    if (!devicePushToken) {
      console.log("No device token available for this driver");
      return;
    }

    const title = "Trip cancellation!";
    const body =  "Trip was cancelled due to user request."

    await sendPushNotification(devicePushToken, title, body);

    console.log(`Notification sent to driver ${driverId}`);

  }catch (error) {
    console.error("Error sending notification:", error);
  }

}


module.exports = {notifyDriverWithTripCancellation}