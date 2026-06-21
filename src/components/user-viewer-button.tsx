"use client";

import { GrDocumentPdf } from "react-icons/gr";
import { FaPhotoVideo } from "react-icons/fa";

export default function UserViewerButton({ driveFile }: {
  driveFile: {
    link: string;
    name: string;
    size: string;
    extension: string;
  }
}){
  const handlerClick = ()=> {
    window.open(driveFile.link);
  }

  return(
    <button 
      type="button" 
      onClick={handlerClick} 
      title="Click para visualizar o arquivo"
      className="flex items-center gap-x-2 hover:bg-gray-100 outline px-3 rounded outline-1 outline-gray-300"
    >
      { driveFile.extension === "pdf" 
        ? <GrDocumentPdf className="text-red-700 size-8" /> 
        : <FaPhotoVideo className="text-yellow-700 size-8" /> 
      }
      <div className="text-start">
        <h2 className="line-clamp-1 font-mono">{driveFile.name}</h2>
        <p className="text-sm font-bold">{driveFile.size}</p>
      </div>
    </button>
  )
}