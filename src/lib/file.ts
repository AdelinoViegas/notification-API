// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types

const fileTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "video/mp4"
];

export class FileSize{
  static validdateFileType(file: File){
    return fileTypes.includes(file.type);
  }

  static getFileSizeToString(fileSize: number){
    if (fileSize < 1e3) {
      return `${fileSize} bytes`;
    } else if (fileSize >= 1e3 && fileSize < 1e6) {
      return `${(fileSize / 1e3).toFixed(1)} KB`;
    } else {
      return `${(fileSize / 1e6).toFixed(1)} MB`;
    }
  }

  static validMaxSize(file: File){
    if(file.size > 2*Math.pow(1024, 2))
      return false;
    return true;
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