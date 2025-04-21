import { NextFunction, Request, Response } from "express";
import { Permit } from "permitio";

const roleCheckMiddleware = (action: string, resource: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const permit = new Permit({
        token: process.env.PERMIT_API_KEY,
        pdp: process.env.PERMIT_PDP_URL,
      });
      const userId = req.body.userInfo._id.toString();
      const allowed = await permit.check(userId, action, resource);
      if (!allowed) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default roleCheckMiddleware;
