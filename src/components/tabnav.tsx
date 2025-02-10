"use client";

import clsx from "clsx";
import { 
  usePathname, 
  useParams 
} from "next/navigation";
import Link from "next/link";

export default function TabNav({
  baseUrl,
  keyParam,
  subPaths,
  isAside,
  idAsIndexPage
}: {
  baseUrl: string;
  keyParam: string;
  isAside?: boolean;
  subPaths: {
    path: string;
    title: string;
  }[];
  idAsIndexPage: boolean; // marca o id como page.tsx da rota
}){
  const pathname = usePathname();
  const paramId = useParams()[keyParam];
  
  return(
    <nav className={clsx({ "w-[20%] border bg-primary/5 px-3 py-2 rounded": isAside })}> 
      <ul className={clsx(
        { "flex md:flex-nowrap flex-wrap gap-x-1 justify-between line-clamp-1 text-center font-bold": !isAside },
        { "flex flex-col w-full gap-y-1": isAside },
      )}>
        {subPaths.map((item, index)=>{
          const absPathname = (idAsIndexPage && index == 0?[baseUrl, paramId]:[baseUrl, paramId, item.path]).join('/');  
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
            {item.title}
        </Link>
      )})}
      </ul>
    </nav>
  )
}