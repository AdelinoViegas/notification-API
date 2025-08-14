"use server";

import axios from "axios";
import type { FileResponse, ListAllFiles, ResponseDriveFile } from "@/app/backend/api/types";

const instance = axios.create({ 
  baseURL: process.env.STORAGE_SRV_URL,
});

export async function upload(params: unknown, authorId: string){
  const res = await instance.post<FileResponse>("/uploads", params, {
    headers: { authorId }
  });

  return res.data;
}

export async function getAllFiles(){
  const res = await instance.get<ListAllFiles>("/files");
  return res.data;
}

export async function getFile(id: string){
  const res = await instance.get<ResponseDriveFile>("/files/file", {
    params: { id }
  });

  return res.data;
}