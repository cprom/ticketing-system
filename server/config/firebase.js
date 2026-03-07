import admin from "firebase-admin";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS in environment");
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export default admin;