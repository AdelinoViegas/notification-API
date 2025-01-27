"use client";

import { useState } from "react";
import Modal from "@/components/modal";
import UserForm from "@/components/forms/user-form";
import Button from "./ui/button";

export default function SignUserModal(){
  const [ state, setState ] = useState(false);
  const toggle = ()=> setState(!state);

  return(
    <div>
      <Button onClick={toggle}>Novo Usuário</Button>
      <Modal 
        title="Cadastro de Usuário"
        open={state} 
        onClose={toggle}>
        <UserForm />
      </Modal>
    </div>
  )
}