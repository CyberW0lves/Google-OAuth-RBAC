import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    const tokenInfo = await client.getTokenInfo(accessToken);
    if (!tokenInfo || tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ email: tokenInfo.email });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.body.userInfo = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export default authMiddleware;
