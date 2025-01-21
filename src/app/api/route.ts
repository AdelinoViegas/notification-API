import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/backend/api/manager/api";

export async function GET(request: NextRequest){
  try{
    const userId = request.nextUrl.searchParams.get('userId'); 
    if(!userId)
      throw new Error("Informe o userId", { cause: "empty_userId"});

    const user = await getUser(userId);

    if(user.message)
      throw new Error(user.message);

    return NextResponse.json({ 
      status: true,
      message: "usuário valido!" 
    });
  }catch(e: unknown){
    const err = e as Error;

    return NextResponse.json({
      message: err.message,
      status: false
    }, { status: 403 })
  }
}