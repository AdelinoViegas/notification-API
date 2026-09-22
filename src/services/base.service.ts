import { Database } from "./types";

export default class BaseService {
  db: Database;

  constructor(db: Database){ 
    this.db = db 
  }
}