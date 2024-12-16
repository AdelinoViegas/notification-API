// "use client";

// import { useEffect, useState } from "react";
// import { useFormState } from "react-dom";
// import { useRouter } from 'next/navigation';
// import InputDetails from "@/components/ui/input-details";
// import Button from "@/components/ui/button";
// import Alert from "@/components/alert";
// import { signExamResult } from "@/app/backend/api/clinical/scheduling-api";

// export default function SignExamResultForm({ scheduleId }:{ scheduleId: string }){
//   const [ state, action ] = useFormState(signExamResult,{ message:"", status:false })
//   const [ messageState, setMessageState ] = useState(false);
//   const { replace } = useRouter(); 

//   useEffect(()=>{
//     if(state.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         setMessageState(false);

//         if(state?.status){
//           replace("/clinical/schedule-exams-services");
//         }
//       }, state?.status?2000:3000);
//     }
//   }, [state]);

//   return(
//     <form {...{action}}>
//       <input
//         type="hidden"
//         value={scheduleId}
//         name="scheduleId"
//       />

//       {/*<InputDetails 
//         required
//         name="result"
//         textLabel="Detalhes dos Resultados"
//         placeholder="Descreve os resultados dos exames do utente"
//       />

//       {/*<Button>Salvar</Button>*/}

//       {
//         state.message && messageState &&
//         <div className="mt-3">
//           <Alert
//             type={state.status?'success':'error'}
//             message={state.message}
//           />
//         </div>
//       }
//     </form>
//   )
// }