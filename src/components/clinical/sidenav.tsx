import Link from 'next/link';
import NavLink from '@/components/clinical/nav-link';
import LogoutButton from '@/components/logout-button';
import Image from 'next/image';
import { getGrantedRoles } from '@/app/backend/api/admin';

export default async function SideNav(){
  const routes = await getGrantedRoles();

  return(
    <div className="bg-white border-r flex sm:h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="rounded-md mb-2 flex h-20 items-end justify-start bg-gradient-to-r from-primary to-sky-500 p-4 md:h-auto"
        href={"/clinical"}
      >
        <div className="flex justify-center md:items-center w-full sm:w-32 text-white md:w-60 gap-3">
          <Image 
            width={100}
            height={100}
            src="/banner.png"
            alt='Master Banner' 
            className='size-10 shadow shadow-white/25'
          /> 

          <div>
            <h2 className='text-xl md:text-3xl uppercase font-semibold font-sans'>Master <span className='text-sm'>&reg;</span></h2>
            <p className='text-xs font-nomo font-medium'>Sistema Integrado de Gestão</p>
          </div>
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLink routes={routes} />
        <div className="hidden h-auto w-full grow md:block rounded-md" />
        <LogoutButton />
      </div>
    </div>
  );
}
