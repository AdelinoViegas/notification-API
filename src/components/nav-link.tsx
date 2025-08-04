'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { managerRoutes } from '@/components/routes';

export default function NavLink(){
  const pathname = usePathname();

  return(
    <>
      {managerRoutes.map((item, index)=>{
        const urlString = pathname.split('/')[2]; 
        const currentRoute = !!(item.href.split('/').includes(urlString) && urlString);

        return(
          <Link
            key={index}
            href={item.href}
            className={clsx("flex rounded-md py-2 px-3 items-center gap-2 border-2 text-sm font-medium hover:bg-blue-100 hover:hover:text-blue-600",
            {
              'text-blue-500 font-bold bg-blue-100 border-blue-300': currentRoute
            }
            )}>
            <p className="hidden md:block">{item.label}</p>
          </Link>
        );
      })}
    </>
  );
}
