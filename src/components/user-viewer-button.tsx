"use client";

import { ResponseDriveFile } from "@/backend/api/types";
import { GrDocumentPdf } from "react-icons/gr";
import { FaPhotoVideo } from "react-icons/fa";

export default function UserViewerButton({ driveFile }: { driveFile: ResponseDriveFile }){
  const handlerClick = ()=> {
    window.open(driveFile.link);
  }
  console.log(driveFile.extension);

  return(
    <button onClick={handlerClick} className="flex justify-start gap-x-3 hover:bg-primary/25 items-center ring-2 ring-blue-500/50  my-3 rounded-lg px-3 py-2">
      { driveFile.extension === "pdf" 
        ? <GrDocumentPdf className="text-red-500 size-8" /> 
        : <FaPhotoVideo className="text-green-500 size-8" /> 
      }
      <div className="text-start">
        <h2 className="line-clamp-1">{driveFile.name}</h2>
        <p className="text-sm font-bold">{driveFile.size}</p>
      </div>
    </button>
  )
}