'use client';

import { useEffect, useState } from "react";
import { 
  usePathname, 
  useRouter 
} from "next/navigation";
import { verifyRouteUserPermission } from "@/app/backend/api/manager/api";
import Modal from "@/components/modal";

export default function Template({ children }:{ children: React.ReactNode }){
  const [ state, setState ] = useState(false);
  const openModal = ()=> setState(true);
  const handleCloseModal = ()=> {
    setState(false);
    router.replace('/clinical');
  };
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(()=>{
    if(pathname !== '/clinical'){
       verifyRouteUserPermission(pathname).then((data)=>{
        if(!data)
          openModal();
      })
    }
  }, [pathname]);
  return(
    <>
      <Modal
        open={state}
        title="Permissão Negada"
        description="Desculpe, não tem permissão para acessar este recurso. Se acredita que isso é um erro ou precisa de acesso, entre em contato com o seu administrador."
        onClose={handleCloseModal}
        alertOnly
      />
      {children}
    </>
  )
}