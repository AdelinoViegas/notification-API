// "use client";

// import { 
//   useEffect,
//   useState,
//   useRef 
// } from "react";
// import { 
//   useRouter, 
//   usePathname, 
// } from "next/navigation";
// import Selection, { SimpleSelectionType } from "@/components/ui/selection";
// import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
// import { getDoctors } from "@/app/backend/api/clinical/api";

// type SelectFilterProps = {
//   unitType?: "laboratory" | "workplace" | "internment";
//   label: string;
//   doctor?:string;
// };
// export default function SelectFilter({
//   unitType,
//   label,
//   doctor
// }:SelectFilterProps){
//   const [ units, setUnits ] = useState<SimpleSelectionType[]>([]);
//   const [ doctors, setDoctors ] = useState<SimpleSelectionType[]>([]);
//   const formRef = useRef<HTMLFormElement>(null);
//   const router = useRouter();
//   const pathname = usePathname();

//   const handler = async()=>{
//     if(unitType){
//       const units = await getUnits(unitType, true) as SimpleSelectionType[];
//       setUnits(units);
//     }else{
//       const doctors = await getDoctors() as SimpleSelectionType[];
//       setDoctors(doctors);
//     }
//   }

//   const action = ()=>{
//     const selectElement = formRef.current?.elements?.item(0) as HTMLSelectElement;
  
//     if(!selectElement.value){
//       return router.push(pathname);
//     }
//     const params = new URLSearchParams();
//     params.set("unitId", selectElement.value);
//     const url = `${pathname}?${params.toString()}`;
//     router.push(url);
//   }

//   useEffect(()=>{
//     handler();
//   }, []);
  
//   if(doctor){
//     return(
//       <form ref={formRef} className="flex items-center gap-3">
//         <Selection
//           options={doctors}
//           label={label}
//           defaultOptionLabel="Todas"
//           onChange={action}
//           className="w-96"
//         />
//       </form>
//     )
//   }else{
//     return(
//       <form ref={formRef} className="flex items-center gap-3">
//         <Selection
//           options={units}
//           label={label}
//           defaultOptionLabel="Todas"
//           onChange={action}
//           className="w-96"
//         />
//       </form>
//     )
//   }
// }