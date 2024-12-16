// "use client";

// import React,{ 
//   useState,
//   useEffect 
// } from "react";
// import clsx from "clsx";
// import Selection from "@/components/ui/selection";
// import { hospitalUnit } from "@/app/backend/api/clinical/translator";

// export default function UnitInputs({ setUnit }:{ setUnit?: string }){
//   const [ isFilledName, setIsFilledName ] = useState("");

//   useEffect(()=>{
//     if(isFilledName)
//       setUnit(isFilledName);
//   },[
//     isFilledName, 
//   ]);

//   return(
//       <div className={clsx(
//         "grid md:grid-cols-2 large:grid-cols-3 gap-3"
//       )}>
//         <Selection
//           name="hospitalName"
//           options={hospitalUnit}
//           label="Escolha a unidade externa"
//           onChange={(e)=>setIsFilledName(e.target.value?e.target.value:"")}
//         />
//       </div>
//   )
// }