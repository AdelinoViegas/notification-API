"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useRouter } from 'next/navigation';

type MenuItem = {
  label: string;
  Icon?: React.ReactNode;
  eventHandler?: ()=>void;
  href?: string;
}

type DropDownProps = {
  children: React.ReactNode;
  menuItems: MenuItem[];
};

export default function DropDown({
  children,
  menuItems,
}: DropDownProps) {
  const router = useRouter();
  const handlerRouter = (url: string)=>{
    router.push(url);
  };

  return (
    <div>
      <Menu>
        <MenuButton className="inline-flex items-center rounded-md shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-white">
          {children}
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border shadow bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {menuItems.map((item, i)=>(
            <MenuItem key={i}>
              <button 
                onClick={item.href?()=>handlerRouter(item.href as string):item.eventHandler} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-500/10">
                {item.label}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  )
}