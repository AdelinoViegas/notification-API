"use server";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { FileHandler } from "@/lib/client-files";
import path from "path";

type WritedFile = {
  name: string;
  binaryData: Buffer;
}

class ServerFileHandler extends FileHandler {
  static async writeFileInPublicDir(file: WritedFile){
    try{

      const filename = file.name;
      const cache_dir = path.join(process.cwd(), "public", process.env.CACHE_DIR as string);
      
      if(!existsSync(cache_dir))
        mkdirSync(cache_dir);

      const externalLInk = path.join('/', process.env.CACHE_DIR as string, filename);
      writeFileSync(path.join(cache_dir, filename), file.binaryData);
      
      return externalLInk;
    }catch(e){
      console.log(e);
      return "#";
    }
  }
}

export {
  ServerFileHandler
};