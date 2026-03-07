import express from 'express'
import admin from "../config/firebase.js";
import { pool, poolConnect, sql } from "../config/db.js";
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

const SESSION_EXPIRES = 1000 * 60 * 60; // 1 hour

router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // create session cookie
  const expiresIn = 5 * 24 * 60 * 60 * 1000;
  const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

  res.cookie("session", sessionCookie, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Logged in" });
});

// REFRESH SESSION
router.post("/refresh", async (req, res) => {
  const { idToken } = req.body;

  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES });

    res.cookie("session", sessionCookie, {
      maxAge: SESSION_EXPIRES,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ success: true });

  } catch {
    res.status(401).json({ message: "Refresh failed" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ success: true });
});


export default router;
