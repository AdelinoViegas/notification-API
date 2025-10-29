export {}

declare global {
  interface MongoError extends Error {
    code: number;
  }
}