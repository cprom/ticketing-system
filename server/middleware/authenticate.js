import admin from "../config/firebase.js";

const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    req.user = decoded; // contains uid, email
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default authenticate;