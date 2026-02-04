declare global {
  interface MongoError extends Error {
    code: number;
  }
  interface Error extends Error {
    code: number;
  }
}