"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { 
  usePathname, 
  useParams,
  useSearchParams,
  useRouter
} from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function TabNav({
  baseUrl,
  keyParam,
  subPaths,
  isAside,
  idAsIndexPage,
  useReactHook
}: {
  baseUrl: string;
  keyParam: string;
  isAside?: boolean;
  subPaths: {
    path: string;
    title: string;
  }[];
  idAsIndexPage: boolean; // marca o id como page.tsx da rota
  useReactHook?: boolean; // para uso que não envolva link (routas por directorios)
}){
  const pathname = usePathname();
  const paramId = useParams()[keyParam];
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams();

  const setRoute = (pathRoute: string)=>{
    try{
      if(searchParams.has('r') && pathRoute){
        if(!!subPaths.find(path => path.path === pathRoute)){
          urlSearchParams.set('r', pathRoute);
          router.push(`${pathname}?${urlSearchParams.toString()}`);
          return;
        }
        throw new Error("Valor inválido!", { cause: "user_error"});
      }
    }catch(e){
      const err = e as Error;
      toast.error(err.cause === "user_error"?err.message:"Erro crítico, contacte o suporte!");
    }
  }
  
  function ReactUI({ path, title, index }:{ path: string; title: string; index: number }){
    if(!useReactHook){
      const absPathname = (idAsIndexPage && index == 0?[baseUrl, paramId]:[baseUrl, paramId, path]).join('/');  
      return(
        <Link 
          href={absPathname} 
          key={index}
          className={clsx("py-2 text-center w-full",
            {
              "bg-tabMenu border-t-2 border-solid border-t-primary bg-white": !isAside && (pathname === absPathname),
              "bg-primary text-white":!isAside && (pathname !== absPathname),
              "sm:rounded-t-3xl": !isAside,
              "text-primary": !isAside,
              "text-primary bg-primary/15 border-primary/70 border-2": isAside && (pathname === absPathname),
              "text-black text-start font-semibold text-sm hover:bg-primary/15 px-3 rounded-lg": isAside
            }
          )}
        >
          {title}
        </Link>
      );
    }else{
      const actualPath = searchParams.get('r');
      const isCurrentPath = actualPath === path;

      return(
        <button
          className={clsx("py-2 text-center w-full",
            {
              "bg-tabMenu border-t-2 border-solid border-t-primary bg-white": !isAside && isCurrentPath,
              "bg-primary text-white":!isAside && !isCurrentPath,
              "sm:rounded-t-3xl": !isAside,
              "text-primary": !isAside,
              "text-primary bg-primary/15 border-primary/70 border-2": isAside && isCurrentPath,
              "text-black text-start font-semibold text-sm hover:bg-primary/15 px-3 rounded-lg": isAside
            }
          )}
          onClick={()=>setRoute(path)}
        >
          {title}
        </button>
      )
    }
  }

  useEffect(()=>{
    if(useReactHook)
      router.replace(`${pathname}?r=${subPaths[0].path}`);
  }, [pathname, router, useReactHook, subPaths]);

  return(
    <nav className={clsx({ "w-[20%] border bg-primary/5 px-3 py-2 rounded": isAside })}> 
      <ul className={clsx(
        { "flex md:flex-nowrap flex-wrap gap-x-1 justify-between line-clamp-1 text-center font-bold": !isAside },
        { "flex flex-col w-full gap-y-1": isAside },
      )}>
        {subPaths.map((item, index)=>(
          <ReactUI 
            {...item} 
            index={index} 
            key={index} 
            />
          )
        )}
      </ul>
    </nav>
  )
}