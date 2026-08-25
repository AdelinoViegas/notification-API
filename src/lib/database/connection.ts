import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dataDirectory = path.resolve(
  process.cwd(),
  "data"
);

fs.mkdirSync(dataDirectory, {
  recursive: true,
});

const databasePath = path.join(
  dataDirectory,
  "notifications.db"
);

export const database = new Database(
  databasePath
);

database.pragma("journal_mode = WAL");