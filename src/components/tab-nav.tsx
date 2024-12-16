'use client';

import TabButton from "@/components/ui/tab-button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const TabNavigationRoutes = [
  {
    route: 'patient',
    label: "Informações Pessoais",
  },
  {
    route: 'geolocation',
    label: "Informações Demográficas",
  }
]

export default function TabNavigation(){
  const paths = usePathname().split('/');
  const absPathname = usePathname();
  const router = useRouter();

  const getCurrentPath = (path: string)=>{
    const url = paths[paths.length-1];
    return url === path;
  }

  const handlerClickRouterRedirect = (path: string)=>{
    if(absPathname === `${absPathname}/${path}`)
      return;
    
    if(path !== 'patient'){
      router.push(`${absPathname}/${path}`);
      return;
    }
  }

  return(
    <nav className="w-full border border-red-500">
      <ul className="flex gap-3">
        {TabNavigationRoutes.map((props, index)=>
          <TabButton
            onClick={()=>handlerClickRouterRedirect(props.route)} 
            key={index} 
            isActive={getCurrentPath(props.route)}>
              {props.label}
          </TabButton>
        )}
      </ul>
    </nav>
  )
}