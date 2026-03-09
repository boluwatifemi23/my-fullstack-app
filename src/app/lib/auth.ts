import jwt from "jsonwebtoken";
import { IUser } from "../utils/user";


const JWT_SECRET = process.env.JWT_SECRET as string;

export const createToken = (user: IUser) =>
  jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const verifyToken = (token: string): { id: string; role: "user" | "admin" } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: "user" | "admin" };
  } catch {
    return null;
  }
};
