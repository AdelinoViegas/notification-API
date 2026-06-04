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

const api = new FetchService({
  baseUrl: String(process.env.API_URL)+"/st/v2",
  headers: {
    Authorization: `Bearer ${await getServiceToken()}`
  }
});

const instance = axios.create({ 
  baseURL: process.env.API_URL,
    headers: {
    Authorization: `Bearer ${await getServiceToken()}`
  }
});


export async function upload(params: FormData, authorId: string){
  // try{
  //   const res = await instance.post<FileResponse>("/uploads", params, {
  //     headers: { authorId }
  //   });

  //   return res.data;
  // }catch (e) {
  //   const err = (e as AxiosError).response?.data as Error;
  //   throw new Error(err.message);
  // }

  const data = await api.post<FileResponse>("/uploads", params, {
    headers: { "x-auth-author-id": authorId },
    params: {}
  });

  return data;
}

export async function getAllFiles(){
  // const res = await instance.get<ListAllFiles>("/files");
  // return res.data;
  return await api.get<ListAllFiles>("/files") as ListAllFiles;
}

export async function getFile(id: string){
  const res = await instance.get<ResponseDriveFile>("/files/", {
    params: { id }
  });

  return res.data;
}

export async function queryCid(ref: string){
  try{
    const res = await instance.get<CidResponse[] | CidResponse | DefaultResponse>(`/cid/10/${ref}`);
    return res.data;
  }catch{
    return [];
  }
}