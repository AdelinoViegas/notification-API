import axios from "axios";
import { genWebToken } from "@/lib/web-token";

interface User {
  _id: string;
  fullname: string;
  username: string;
  group: { name: string }
}

const instance = axios.create({ 
  baseURL: process.env.ADMIN_SRV_URL,
  headers: {
    Authorization: `Bearer ${await genWebToken()}`
  } 
});

export async function getUsers(): Promise<User[]>{
  const res = await instance.get("/users", {
    params: {
      g: "clinico"
    }
  });

  return res.data.data;
}

export async function getUser(id: string){
  const res = await instance.get<User>("/users/user", {
    params: {
      id
    }
  });

  return res.data;
}