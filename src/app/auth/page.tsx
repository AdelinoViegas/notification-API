import { redirect } from "next/navigation";
import { middleware } from "./middleware";

export default async function Auth({ 
  searchParams
}:{
  searchParams: Promise<{ t: string }>
}){

  const { t } = await searchParams;

  if(!t) 
    redirect(process.env.LOGIN_URL as string);

  await middleware(t);

  return redirect("/clinical");
}