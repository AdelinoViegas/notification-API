import { NextResponse as Res, NextRequest as Req } from "next/server";
import { whoIsUser } from "@/lib/web-token";
import { checkUserPermission } from "../backend/api/manager/api";

export async function GET(req: Req){
  try{
    const userId = await whoIsUser();
    if(!userId || !req.nextUrl.searchParams.has('p'))
      throw new Error("sem login iniciado!");

    const pathname = atob(req.nextUrl.searchParams.get('p') as string);
    const response = await checkUserPermission(pathname);

    if(!response.status)
      throw new Error(response.message);
    
    return Res.json({ status: true });
  }catch(e){
    const err = e as Error;

    console.log('error: ', err.message);
    return Res.json({ status: false }, { status: 403 });
  }
}