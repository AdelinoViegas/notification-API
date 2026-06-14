"use server";

import axios from "axios";
import type { 
  CidResponse, 
  DefaultResponse, 
  FileResponse, 
  ListAllFiles, 
  ResponseDriveFile 
} from "@/backend/api/types";
import { getServiceToken } from "@/lib/web-token";
import { FetchService } from "@/lib/fetch";

interface DriveFile {
  name: string;
  linkPathname: string;
  metadata: {
    name: string;
    size: string;
    type: string;
    humanSize: string;
  }
}

interface FileError {
  message: string;
  error: string;
}

interface CidData {
  code: string;
  value: string;
}

interface CidDataItems {
  items: CidData[];
  total: number;
}

interface UploadedFile {
  data: { id: string; link: string },
  message: string;
}

const api = new FetchService({
  url: process.env.API_URL as string,
  base: "/st/v2",
  headers: {
    Authorization: `Bearer ${await getServiceToken()}`,
  }
});

const instance = axios.create({ 
  baseURL: process.env.API_URL,
    headers: {
    Authorization: `Bearer ${await getServiceToken()}`
  }
});


export async function upload(params: FormData, authorId: string){
  try{
    const data = await api.post<UploadedFile | FileError>("/uploads", params, {
      headers: { 
        "x-auth-author-id": authorId,
        "x-forwarded-uri": "/v2/uploads"
      },
      params: {}
    });

    return data;
  }catch(e){
    console.error(e);
    return null;
  }
}

export async function getAllFiles(){
  return await api.get<ListAllFiles>("/files", {
    headers: { "x-forwarded-uri": "/v2/files" },
    params: {}
  });
}

export async function getFileById(id: string){
  try{
    const data = await api.get<DriveFile | FileError>(`/files/${id}`, {
      headers: { "x-forwarded-uri": "/v2/files/:id" },
      params: {}
    });

    return data;
  }catch(e){
    console.error(e);
    return null;
  }
}

export async function queryCid(ref: string){
  try{
    return await api.get<CidData | CidDataItems>(`/cid/10/${ref}`);
  }catch (e){
    console.error(e);
    return null;
  }
}