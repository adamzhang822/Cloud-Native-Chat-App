// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.censorChannelName = functions.firestore
  .document(`channels/{channelId}`)
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    if (data) {
      const name = data.name;
      const sanitized = sanitizeText(name);
      if (name === sanitized) return null;
      else {
        functions.logger.log(`New channel name has been censored`);
        return snapshot.ref.update({ name: sanitized });
      }
    } else {
      return null;
    }
  });

exports.censorMessage = functions.firestore
  .document(`channels/{channelId}/messages/{messageId}`)
  .onWrite((change, context) => {
    const data = change.after.data();
    if (data) {
      const text = data.text;
      const censoredText = sanitizeText(text);
      if (text === censoredText) {
        return;
      } else {
        functions.logger.log("A post has benn censored");
        return change.after.ref.update({ text: censoredText });
      }
    }
  });

exports.censorReplies = functions.firestore
  .document(`channels/{channelId}/messages/{messageId}/replies/{replyId}`)
  .onWrite((change, context) => {
    const data = change.after.data();
    if (data) {
      const text = data.text;
      const censoredText = sanitizeText(text);
      if (text === censoredText) {
        return;
      } else {
        functions.logger.log("A reply to a post has been censored");
        return change.after.ref.update({ text: censoredText });
      }
    }
  });

const sanitizeText = (name) => {
  if (name.includes("taboo")) {
    return "censored!";
  } else {
    return name;
  }
};
