"use server";

import axios from "axios";
import type { CidResponse, FileResponse, ListAllFiles, ResponseDriveFile } from "@/backend/api/types";
import { getServiceToken } from "@/lib/web-token";

const instance = axios.create({ 
  baseURL: process.env.API_URL+"/st",
  headers: {
    Authorization: `Bearer ${getServiceToken()}`
  }
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

export async function queryCid(ref: string){
  const res = await instance.get<CidResponse>(`/cid/10/${ref}`);
  return res.data;
}