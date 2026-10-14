import { createMiddleware } from "hono/factory";
import { Env } from "./auth";

// Extending Hono's Variables type so TypeScript recognizes c.get("user") etc.
declare module "hono" {
  interface ContextVariableMap {
    user: any;
    session: any;
    services: {
      db: any;
      auth: any;
    };
  }
}

/**
 * Auth middleware: validates session and attaches user/session to context.
 * Must be used after the services middleware (which populates c.get("services")).
 */
export const authMiddleware = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    try {
      const { auth } = c.get("services");
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      c.set("user", session.user);
      c.set("session", session.session);

      await next();
    } catch (error) {
      return c.json({ message: "Unauthorized" }, 401);
    }
  }
);
