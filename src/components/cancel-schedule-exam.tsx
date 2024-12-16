// "use client";

// import { 
//   useEffect,
//   useState,
//   useActionState, 
//   useCallback
// } from "react";
// import { useRouter } from "next/navigation";
// import { cancelScheduleExam } from "@/app/backend/api/clinical/scheduling-api";
// import Button from "@/components/ui/button";
// import { TrashIcon } from "@heroicons/react/24/outline";
// import Modal from "@/components/modal";
// import InputDetails from "@/components/ui/input-details";
// import Alert from "@/components/alert";

// export default function CancelScheduleExam({ scheduleId }: { scheduleId: string }){
//   const [ state, action ] = useActionState(cancelScheduleExam, { message: "", status: false });
//   const [ modalState, setModalState ] = useState(false);
//   const toggle = useCallback(()=> setModalState(!modalState), [modalState]);
//   const [ messageState, setMessageState ] = useState(false);
//   const router = useRouter();

//   useEffect(()=>{
//     if(state.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         if(state.status){
//           toggle();
//           router.replace('/clinical/schedule-exams-services');
//         }
//         setMessageState(false);
//       }, 2000);
//     }
//   }, [state, router, toggle]);
  
//   return(
//     <div>
//       <Button onClick={toggle} cancel className="gap-2 items-center">
//         <TrashIcon className="w-6" />
//         Cancelar
//       </Button>

//       <Modal 
//         title="Cancelar o agendamento" 
//         onClose={toggle} 
//         open={modalState}>
//         <form {...{action}}>
//           <input type="hidden" name="scheduleId" value={scheduleId} />
//           <InputDetails
//             textLabel="Motivo do cancelamento"
//             required
//             placeholder="Descreva o motivo do cancelamento"
//             name="reason"
//           />

//           <div className="justify-end flex gap-3">
//             <Button 
//               cancel 
//               type="button" 
//               onClick={toggle}>
//                 Cancelar
//             </Button>
//             <Button>Salvar</Button>
//           </div>
//         </form>

//         {
//           state.message && messageState &&
//           <div className="mt-3">
//             <Alert
//               type={state.status?'success':'error'}
//               message={state.message}
//             />
//           </div>
//         }
//       </Modal>
//     </div>
//   )
// }