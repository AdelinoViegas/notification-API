import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/backend/api/manager/api";

export async function GET(request: NextRequest){
  try{
    const userId = request.nextUrl.searchParams.get('userId'); 
    const dest = request.nextUrl.searchParams.get('dest');

    if(!userId)
      throw new Error("Informe o userId", { cause: "empty_userId"});

    const user = await getUser(userId);
    console.log(dest);

    if(user.message)
      throw new Error(user.message);
    
    if(dest !== "/manager")
      if(!user.session?.isActive)
        throw new Error("Sessão terminada!", { cause: "session_ended_by_user"});

    return NextResponse.json({ 
      status: true,
      message: "usuário valido!" 
    });
  }catch(e: unknown){
    const err = e as Error;

    return NextResponse.json({
      message: err.message,
      status: false,
      cause: err.cause
    }, { status: 403 })
  }
}

// export async function POST(request: NextRequest){
//   try{
    
//   }catch(e: unknown){

//   }
// }