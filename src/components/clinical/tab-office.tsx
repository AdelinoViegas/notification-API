"use client";

import clsx from "clsx";
import { 
  usePathname, 
  useParams 
} from "next/navigation";
import Link from "next/link";

export default function Taboffice() {
  const pathname = usePathname();
  const params = useParams();
  const userId = params.patientId;
  
  const routes = [
    {
      href: `/clinical/urgency-bank/${userId}`,
      label: "Ficha de Cadastro",
    },
    {
      href:`/clinical/urgency-bank/${userId}/screening`,
      label: "Ficha de Triagem",
    },
    {
      href: `/clinical/urgency-bank/${userId}/anamnesis`,
      label: "Anamnese", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/exam`,
      label: "Exames", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/clinical-diary`,
      label: "Diário Clínico",
    },
    {
      href: `/clinical/urgency-bank/${userId}/prescription`,
      label: "Receituário", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/dispense`,
      label: "Altas", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/consult`,
      label: "Consultas", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/surgery`,
      label: "Cirurgia", 
    },
    {
      href: `/clinical/urgency-bank/${userId}/transfer`,
      label: "Transferência", 
    }
  ];
  
  return(
    <nav className="w-60 rounded-e-xl overflow-hidden">
      <ul className="flex flex-col w-full h-full">
        {routes.map(({label, href}, index)=>(
          <Link 
            href={href} 
            key={index}
            className={clsx("py-2 flex items-center justify-center w-full h-full text-primary",
              {
                "bg-tabMenu border-e-2 border-e-solid border-e-primary bg-white font-medium": index === 0 ?pathname === href:pathname.split('/').includes(href.split('/')[href.split('/').length - 1]),
                "bg-primary text-white": !(index === 0 ?pathname === href:pathname.split('/').includes(href.split('/')[href.split('/').length - 1])),
              }
            )}>
              {label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}