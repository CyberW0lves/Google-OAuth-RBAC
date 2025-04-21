import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Permit } from "permitio";
import User from "../models/User";

const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PERMIT_PDP_URL,
});

router.post("/login", (req: Request, res: Response) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
  });

  res.status(200).json({ authUrl });
});

router.post("/callback", async (req: Request, res: Response): Promise<any> => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Invalid code" });

    const { tokens } = await client.getToken(code);
    if (!tokens || !tokens.access_token || !tokens.id_token)
      return res.status(400).json({ error: "Invalid code" });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload?.email });
    if (!user) {
      user = await new User({
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        email: payload?.email,
        picture: payload?.picture,
        refreshToken: tokens.refresh_token,
      }).save();

      await permit.api.syncUser({
        key: user._id.toString(),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
      });
    }

    res.cookie("accessToken", tokens.access_token, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("userInfo", JSON.stringify(user), {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Authentication failed");
  }
});

router.post("/refresh", async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token found" });

    client.setCredentials({ refresh_token: refreshToken });
    const { token: accessToken } = await client.getAccessToken();

    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to refresh access token" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("userInfo");
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out" });
});

export default router;
