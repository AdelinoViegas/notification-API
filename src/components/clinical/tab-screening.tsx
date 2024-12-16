"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TabScreening() {
  const pathname = usePathname();
  const paths = pathname.split('/');
  const userId = paths[3];

  const routes = [
    {
      href: `/clinical/screening/${userId}`,
      label: "Ficha de Cadastro",
    },
    {
      href:`/clinical/screening/${userId}/reason`,
      label: "Motivo da Vinda",
    },
    {
      href: `/clinical/screening/${userId}/vital-signals`,
      label: "Sinais Vitais", 
    },
    {
      href: `/clinical/screening/${userId}/priority`,
      label: "Grau de Prioridade",
    },
    {
      href: `/clinical/screening/${userId}/status`,
      label: "Estado actual", 
    },
    {
      href: `/clinical/screening/${userId}/advice`,
      label: "Recomendações",
    },
  ];

  return(
    <nav>
      <ul className="grid grid-cols-6 font-semibold text-center w-full">
        {routes.map(({label, href}, index)=>(
          <Link 
            href={href} 
            key={index}
            className={clsx("rounded-t-3xl py-2 flex items-center justify-center w-full h-full text-primary",
              {
                "bg-tabMenu border-t-2 border-solid border-t-primary bg-white": pathname === href,
                "bg-primary text-white": pathname !== href,
              }
            )}>
              {label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}