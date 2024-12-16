import LogoutButton from '@/components/logout-button';
import NavLink from '@/components/nav-link';
import Link from 'next/link';

export default function SideNav(){
  return(
    <div className="bg-white border-r flex sm:h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="rounded-md mb-2 flex h-20 items-end justify-start bg-primary p-4 md:h-auto"
        href={"/manager"}
      >
      <div className="flex justify-center w-full md:flex-none sm:w-32 text-white md:w-60">
        <h2 className='text-xl md:text-3xl uppercase font-medium font-sans'>master</h2>
      </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLink />
        <div className="hidden h-auto w-full grow md:block rounded-md" />
        <LogoutButton />
      </div>
    </div>
  );
}
