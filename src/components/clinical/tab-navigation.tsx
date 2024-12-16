import clsx from "clsx";

export default function TabNavigation({ count }:{count:number}) {

  const routes = [
    {
      nextTab:0,
      label:"Informações Pessoais",
    },
    {
      nextTab:1,
      label:"Informações Demográficas"   
    },
    {
      nextTab:2,
      label:"Responsáveis",
    },
    {
      nextTab:3,
      label:"Grupos de Utentes",   
    },
    {
      nextTab:4,
      label:"Tipos de acesso",
    },
  ];

  return (
    <nav className="mt-4">
      <ul className="grid grid-cols-5 font-semibold text-center">
        {routes.map(({label, nextTab}, index)=>(
          <li key={index}
              className={clsx("rounded-t-3xl py-2 flex items-center justify-center w-full h-full text-primary",
                {
                  "bg-tabMenu border-t-2 border-solid border-t-primary bg-white":count === nextTab,
                  "bg-primary text-white": count !== nextTab,
                }
              )}
            >
              {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}
