"use server";

import { writeFileSync } from "fs";
import { FileHandler } from "@/lib/client-files";

type WritedFile = {
  name: string;
  binaryData: Buffer;
}

const cache_dir = process.env.CACHE_DIR;
const externalPublicDir = `${process.cwd()}/public/${cache_dir}`; 

class ServerFileHandler extends FileHandler {
  static async writeFileInPublicDir(file: WritedFile){
    try{
      const filePathLocation = `${externalPublicDir}/${file.name}`;
      const externalLInk = `${cache_dir}/${file.name}`;
      writeFileSync(filePathLocation, file.binaryData);
      
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