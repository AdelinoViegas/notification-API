"use server";

import { writeFileSync } from "fs";
import { FileSize } from "@/lib/file";

type WritedFile = {
  name: string;
  binaryData: Buffer;
}

const externalPublicDir = process.cwd()+'/public/open-files'; 

class ServerFileHandler extends FileSize {
  static async writeFileInPublicDir(file: WritedFile){
    try{
      const filePathLocation = `${externalPublicDir}/${file.name}`;
      const externalLInk = `/open-files/${file.name}`;
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