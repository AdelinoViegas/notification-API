import { FastifyInstance } from "fastify";
import { authenticate } from "../../../plugins/auth/hooks";
import create from "./create";
import stream from "./stream";
import list from "./list";import get from "./get";
import read from "./read";
import unread from "./unread";

export async function registerNotificationRoutes(
  app: FastifyInstance
) {
  app.addHook(
    "onRequest",
    authenticate
  );

  create(app);
  stream(app);
  unread(app);
  list(app);
  read(app);
  get(app);
}