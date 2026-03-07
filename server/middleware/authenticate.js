import admin from "../config/firebase.js";
import { pool, poolConnect, sql } from "../config/db.js";

const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // verify firebase session
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);

    await poolConnect;

    const result = await pool.request()
      .input("FirebaseUID", sql.NVarChar, decoded.uid)
      .query(`
        SELECT 
          u.UserID,
          u.Email,
          u.FullName,
          r.RoleName
        FROM dbo.Users u
        JOIN dbo.Roles r ON r.RoleID = u.RoleID
        WHERE FirebaseUID = @FirebaseUID
      `);

    const dbUser = result.recordset[0];

    if (!dbUser) {
      return res.status(401).json({ message: "User not found in database" });
    }

    // attach user to request
    req.user = {
      uid: decoded.uid,
      userId: dbUser.UserID,
      email: dbUser.Email,
      fullName: dbUser.FullName,
      role: dbUser.RoleName
    };

    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default authenticate;
