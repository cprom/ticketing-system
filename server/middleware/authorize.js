import { pool, poolConnect, sql } from "../config/db";

const authorize = (roles = []) => {
  return async (req, res, next) => {
    await poolConnect;

    const result = await pool.request()
      .input("FirebaseUID", sql.NVarChar, req.user.uid)
      .query(`
        SELECT Role FROM dbo.Users
        WHERE FirebaseUID = @FirebaseUID
      `);

    const user = result.recordset[0];

    if (!user || !roles.includes(user.Role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export default authorize;
