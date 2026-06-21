"use client";

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { clinicalIcons } from '@/components/routes';
import Link from 'next/link';

interface Route {
  href: string;
  route: string;
  label: string;
}

export default function NavLink({ routes }:{ routes: Route[] }){
  const pathname = usePathname();
  const icons = new Map<string, typeof clinicalIcons[number]>();
  clinicalIcons.forEach(e => icons.set(e.route, e));

  return(
    <div className="overflow-y-auto md:h-[80vh] space-y-1 mb-2 sm:mb-0">
      {routes.map((item, index)=>{
        const urlString = pathname.split('/')[2]; 
        const currentRoute = !!(item.href.split('/').includes(urlString) && urlString);
        const Icon = icons.get(item.route)?.Icon;

        return(
          <Link
            key={index}
            href={item.href}
            className={clsx(
              "flex rounded-md py-2 px-3 items-center gap-2 border-2 text-nowrap",
              "text-sm font-medium hover:to-primary/25 hover:text-primary/50 hover:border-primary/50",
              "bg-gradient-to-t from-gray-300",
              { "text-primary font-bold bg-gradient-to-t from-primary/50 border-primary/50": currentRoute }
            )}>
            {!!Icon && <Icon fontSize={25} />}
            <p>{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
}