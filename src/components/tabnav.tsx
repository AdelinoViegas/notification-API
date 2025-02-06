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
  idAsIndexPage
}: {
  baseUrl: string;
  keyParam: string;
  subPaths: {
    path: string;
    title: string;
  }[];
  idAsIndexPage: boolean; // para marcar o primeiro elementro da rota como index o id da pagina
}){
  const pathname = usePathname();
  const paramId = useParams()[keyParam];
  
  return(
    <nav> 
      <ul className="flex md:flex-nowrap flex-wrap gap-x-1 justify-between line-clamp-1 text-center font-bold">
        {subPaths.map((item, index)=>{
          const absPathname = (idAsIndexPage && index == 0?[baseUrl, paramId]:[baseUrl, paramId, item.path]).join('/');  
          return(
            <Link 
              href={absPathname} 
              key={index}
              className={clsx("sm:rounded-t-3xl py-2 text-center w-full text-primary",
                {
                  "bg-tabMenu border-t-2 border-solid border-t-primary bg-white":pathname === absPathname,
                  "bg-primary text-white":pathname !== absPathname,
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