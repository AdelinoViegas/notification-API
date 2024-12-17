import { 
  rmSync, 
  readdirSync
} from "fs";

const externalPublicDir = process.cwd()+'/public/open-files'; 
const timeInMinute = 1000 * 60; // 1 min

class ServerFileHandler {
  static async clearPublicDir(){
    setInterval(()=>{
      for(const file of readdirSync(externalPublicDir))
        rmSync(`${externalPublicDir}/${file}`);
    }, timeInMinute * 30)
  }
}

export {
  ServerFileHandler
};