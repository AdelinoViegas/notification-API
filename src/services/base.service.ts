import { Database } from "./types.js";

export default class BaseService {
  db: Database;

  constructor(db: Database){ 
    this.db = db 
  }
}