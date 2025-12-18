import { AuthUser } from "src/auth/decorator/current-user.decorator";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}