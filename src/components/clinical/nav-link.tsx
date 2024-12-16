'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { type Route, HeroIcon } from '@/app/backend/api/manager/types';
import { clinicalRoutes } from '@/components/routes';

export default function NavLink({ routes }:{ routes: Route[] }){
  const pathname = usePathname();

  return(
    <>
      {routes.map((item, index)=>{
        const urlString = pathname.split('/')[2]; 
        const currentRoute = !!(item.href.split('/').includes(urlString) && urlString);
        const HeroIcon = clinicalRoutes.find((props)=>props.route === item.route)?.Icon as HeroIcon;

        return(
          <Link
            key={index}
            href={item.href}
            className={clsx("flex rounded-md py-2 px-3 items-center gap-2 border-2 text-sm font-medium hover:bg-blue-100 hover:hover:text-blue-600",
            {
              'text-blue-500 font-bold bg-blue-100 border-blue-300': currentRoute
            }
            )}>
            <HeroIcon fontSize={25} />
            <p className="hidden md:block">{item.label}</p>
          </Link>
        );
      })}
    </>
  );
}
