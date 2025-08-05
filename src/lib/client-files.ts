// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types

const fileTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "video/mp4"
];

const MAX_FILE_SIZE = Math.pow(1024, 2); // 2MB

export class FileHandler{
  static validdateFileType(file: File){
    return fileTypes.includes(file.type);
  }

  static getFileHandlerToString(FileHandler: number){
    if (FileHandler < 1e3) {
      return `${FileHandler} bytes`;
    } else if (FileHandler >= 1e3 && FileHandler < 1e6) {
      return `${(FileHandler / 1e3).toFixed(1)} KB`;
    } else {
      return `${(FileHandler / 1e6).toFixed(1)} MB`;
    }
  }

  static validMaxSize(file: File){
    if(file.size > MAX_FILE_SIZE)
      return false;
    return true;
  }

  static getMaxFileSize(){
    return this.getFileHandlerToString(MAX_FILE_SIZE);
  }

  static getExtension(name: string){
    return name.split('.')[1];
  }

  static handleFileName(name: string){
    if(name.length > 28)
      return name.slice(0, 10) + '...' + name.slice(name.length - 10, name.length);
    return name;
  }

  static async isEmpty(file: File){
    return (!file.size && !(await file.arrayBuffer()).byteLength);
  }
}