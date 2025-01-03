// "use client";
// import { useState } from "react";
// import clsx from "clsx";

// export type DataType = {
//   name: string; // _id do objecto
//   label: string; // o texto a ser apresentado ao usuário
// };

// // interface SelectProps extends React.HtmlHTMLAttributes<HTMLInputElement>{
// //   label: string; 
// //   data: DataType[];
// //   name?: string;
// // } 
// type SelectProps = {
//   label: string; 
//   data: DataType[];
//   name?: string;
// } & React.HtmlHTMLAttributes<HTMLInputElement>;

// export default function Select({
//   label,
//   data,
//   name,
//   ...rest
// }: SelectProps){
//   const [ value, setValue ] = useState("");
//   const [ state, setState ] = useState(false);
//   const toggle = ()=> setState(!state);

//   function handlerSelectedItem({
//     name
//   }:{
//     name: string;
//   }){
//     setValue(name);
//     toggle();
//   }
  
//   return(
//     <div className="relative" {...rest}>
//       <label className="text-xs font-semibold text-gray-600">{label}</label>
      
//       <div onClick={toggle} className={clsx("text-base select-none min-w-48 bg-white border-2 px-3 py-1 rounded-lg hover:border-blue-200")}>
//         <p className="font-medium">{value?data.find((item)=>item.name === value)?.label:Boolean(data.length)?"Selecione":"Sem informações"}</p>
//       </div>
      
//       <input type="hidden" name={name} value={value} />

//       {Boolean(data.length)&&
//       <div className={clsx("absolute min-w-48 max-h-96 overflow-y-auto z-50 shadow flex flex flex-col bg-white px-3 py-2 mt-1 border rounded-xl select-none",
//         {
//           "hidden": !state
//         }
//       )}>
//         {data.map((props, index)=>(
//           <button
//             key={index}
//             onClick={()=>handlerSelectedItem(props)} 
//             type="button" 
//             className="text-start py-1 px-3 rounded-lg hover:bg-gray-100">
//             {props.label}
//           </button>
//         ))
//         }
//       </div>}
//     </div>
//   )
// }

/*

  // tipar previamente a variavel state 
  const [ groupData, setGroupData ] = useState<{ name: string; label: string}[]>([]);

  //aplicar a formatação dos dados vindo do backend
  const getDataToSelect = async ()=>{
    const data = await getUserGroups();
    let listCopy:{
      name: string;
      label: string;
    }[] = [];

    for(let i = 0; i < data.length; i++){
      /*
        para pegar nos dados e ficarem no 
        formato que o componente Select precisa 

        { 
          name: string; referente ao _id do Antigo Selection
          label: string; 
        }

        -ver a implementação do Select
      
        listCopy.push({
          name: data[i]._id,
          label: data[i].label
        });
      }
  
      setGroupData(listCopy);
    }
*/