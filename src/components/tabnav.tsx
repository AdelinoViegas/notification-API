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
  idAsIndexPage: boolean; // para marcar o primeiro elementro da rota como index o id da pagina
}){
  const pathname = usePathname();
  const paramId = useParams()[keyParam];
  
  return(
    <nav className={clsx({ "w-60 rounded-e-xl overflow-hidden": isAside })}> 
      <ul className={clsx(
        { "flex md:flex-nowrap flex-wrap gap-x-1 justify-between line-clamp-1 text-center font-bold": !isAside },
        { "flex flex-col w-full h-full": isAside },
      )}>
        {subPaths.map((item, index)=>{
          const absPathname = (idAsIndexPage && index == 0?[baseUrl, paramId]:[baseUrl, paramId, item.path]).join('/');  
          return(
            <Link 
              href={absPathname} 
              key={index}
              className={clsx("py-2 text-center w-full text-primary",
                {
                  "bg-tabMenu border-t-2 border-solid border-t-primary bg-white": !isAside && (pathname === absPathname),
                  "bg-primary text-white":!isAside && (pathname !== absPathname),
                  "sm:rounded-t-3xl": !isAside,
                  "": isAside
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