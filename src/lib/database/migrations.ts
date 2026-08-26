import { database } from "./connection";

export function runMigrations(): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      title TEXT,
      message TEXT,
      data TEXT,
      status TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      read_at TEXT,
      timestamp TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      delivered_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_receiver
    ON notifications(receiver_id);

    CREATE INDEX IF NOT EXISTS idx_notifications_receiver_read
    ON notifications(receiver_id, read);

    CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON notifications(created_at);

    CREATE INDEX IF NOT EXISTS idx_notifications_status
    ON notifications(status);
  `);
}