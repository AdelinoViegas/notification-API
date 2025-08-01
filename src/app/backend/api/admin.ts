import axios from "axios";
import { genWebToken } from "@/lib/web-token";

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL,
  headers: {
    Authorization: `Bearer ${await genWebToken()}`
  } 
});

export async function getUsers(){
  const res = await instance.get("/users", {
    params: {
      g: "clinico"
    }
  });

  return res.data.data;
}

export async function getUser(){}