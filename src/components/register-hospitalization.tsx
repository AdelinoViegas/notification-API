"use client";

import { useState } from "react";
import Modal from "./modal";

export default function RegisterHospitalization(){
  const [ modalState, setModalState ] = useState(false);

  return(
    <>
      <button onClick={()=>setModalState(true)} className="text-blue-500 hover:underline">
        Acomodar
      </button>
      <Modal title="test" open={modalState} onClose={()=>setModalState(false)} />
    </>
  );
}