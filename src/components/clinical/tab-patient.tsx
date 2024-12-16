"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TabPatient() {
  const pathname = usePathname();
  const paths = pathname.split('/');
  const userId = paths[3];
  const routes = [
    {
      href: `/clinical/patient/${userId}`,
      label: "Ficha de Cadastro",
    },
    {
      href:`/clinical/patient/${userId}/screening`,
      label: "Seguir Triagem",
    },
    {
      href: `/clinical/patient/${userId}/schedule-appointment`,
      label: "Agendar Consulta", 
    },
    {
      href: `/clinical/patient/${userId}/schedule-exam`,
      label: "Agendar Exame",
    },
    {
      href: `/clinical/patient/${userId}/photo`,
      label: "Inserir Foto", 
    },
    {
      href: `/clinical/patient/${userId}/card`,
      label: "Cartão de Utente",
    },
  ];

  return(
    <nav className="">
      <ul className="grid grid-cols-6 font-semibold text-center w-full">
        {routes.map(({label, href}, index)=>(
          <Link href={href} key={index}
              className={clsx("rounded-t-3xl py-2 flex items-center justify-center w-full h-full text-primary",
                {
                  "bg-tabMenu border-t-2 border-solid border-t-primary bg-white":pathname === href,
                  "bg-primary text-white":pathname !== href,
                }
              )}
            >
              {label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
