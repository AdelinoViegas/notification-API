"use client";

import { BsPower } from 'react-icons/bs';
import { logout } from '@/backend/api/admin';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export default function LogoutButton({ 
  baseUrl,
  className 
}:{ 
  baseUrl: string;
  className?: string; 
}){

  const handler = ()=>{
    logout()
    .then((ev)=>toast.success(ev.message))
    .catch(e => toast.error(e.response.data.message))
    .finally(()=>{
      window.location.href = baseUrl ?? "/";
    })
  }
  return(
    <button
      type="button" 
      onClick={handler} 
      className={clsx(
        className ?? "rounded-md flex w-full grow md:py-2 items-center justify-center gap-2 bg-red-100 border-red-300 border-2 hover:bg-red-200 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 text-red-500"
    )}>
      <BsPower className="w-5" />
      <div className="hidden md:block">Sair</div>
    </button>
  );
}