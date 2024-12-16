import { PowerIcon } from '@heroicons/react/24/outline';
import { endSession } from '@/app/backend/api/manager/api';

export default function LogoutButton(){
  return(
    <form action={endSession}>
      <button className="rounded-md flex w-full grow md:py-2 items-center justify-center gap-2 bg-red-100 border-red-300 border-2 hover:bg-red-200 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 text-red-500">
        <PowerIcon className="w-5" />
        <div className="hidden md:block">Sair</div>
      </button>
    </form>
  )
}