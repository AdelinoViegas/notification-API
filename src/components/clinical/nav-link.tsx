'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { type Route } from '@/app/backend/api/manager/types';
import { clinicalIcons } from '@/components/routes';

export default function NavLink({ routes }:{ routes: Route[] }){
  const pathname = usePathname();
  const router = useRouter();
  const icons = new Map<string, typeof clinicalIcons[number]>();
  clinicalIcons.forEach(e => icons.set(e.route, e));
  
  return(
    <>
      {routes.map((item, index)=>{
        const urlString = pathname.split('/')[2]; 
        const currentRoute = !!(item.href.split('/').includes(urlString) && urlString);
        const Icon = icons.get(item.route)?.Icon;

        return(
          <button
            key={index}
            onClick={()=>{
              router.replace(item.href);
              router.refresh();
            }}
            className={clsx(
              "flex rounded-md py-2 px-3 items-center gap-2 border-2",
              "text-sm font-medium hover:bg-blue-100 hover:hover:text-blue-600",
              { "text-blue-500 font-bold bg-blue-100 border-blue-300": currentRoute }
            )}>
            {!!Icon && <Icon fontSize={25} />}
            <p className="hidden md:block">{item.label}</p>
          </button>
        );
      })}
    </>
  );
}
