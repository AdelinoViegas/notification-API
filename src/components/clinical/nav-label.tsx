"use client";

import { usePathname } from "next/navigation";

type RouteMap = Map<string, { 
  href: string; 
  label: string;
}>;

export default function NavLabel({ routes }: { routes: RouteMap }){
  const pathname = usePathname();

  return(
    <div className="px-8 lg:px-48 border-b py-3 mb-3">
      <h2 className="text-xl font-medium">{routes.get(pathname.split("/").slice(0, 3).join("/"))?.label}</h2>
    </div>
  )
}