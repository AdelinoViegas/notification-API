import { NextResponse as Res, NextRequest as Req } from "next/server";
import { whoIsUser } from "@/lib/web-token";

export async function GET(req: Req){
  try{
    const userId = await whoIsUser();
    console.log("DATA: ", req.nextUrl.searchParams);
    console.log({ userId })
    return Res.json({ status: true });
  }catch(e){
    console.log('error: ', e.message);
    return Res.json({ status: false }, { status: 403 });
  }
}