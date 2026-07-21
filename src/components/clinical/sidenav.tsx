import Link from 'next/link';
import NavLink from '@/components/clinical/nav-link';
import FeedbackLogoutButton from '@/components/feedback/feedback-logout-button';
import Image from 'next/image';
import { getGrantedRoles } from '@/backend/api/admin';
import clsx from 'clsx';

export default async function SideNav(){
  const routes = await getGrantedRoles();

  return(
    <div className={clsx(
      "fixed top-0 left-0 bg-white border-r flex lg:h-full flex-col px-3 py-4 md:px-2",
      "md:w-2/3 min-[958px]:w-2/4",  
      "min-[1144px]:w-[320px]"
    )}>
      <Link href="/clinical">
        <div className="bg-gradient-to-b from-[#5ba3cf] to-primary text-white flex gap-x-3 px-3 py-2 mb-1 rounded items-center">
          <Image 
            width={100}
            height={100}
            src="/banner.png"
            alt='Master Banner' 
            className='size-10 shadow shadow-white/25'
          /> 

          <div>
            <h2 className='text-xl md:text-3xl uppercase font-semibold font-sans'>Master ERP<span className='text-sm'>&reg;</span></h2>
            <p className='text-xs font-nomo font-medium'>Sistema Integrado de Gestão</p>
          </div>
        </div>
      </Link>

      <div className="md:h-full flex justify-between flex-col">
        <NavLink routes={routes} />
        <FeedbackLogoutButton goo={process.env.NODE_ENV !== "development"} />
      </div>
    </div>
  );
}
