"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import { useState } from "react";
import InputDetails from "./ui/input-details";
import InputField from "./ui/input-field";


export default function Hospitalization(){
  const [modalstate, setModalState] = useState(false);
  const  openModal = ()=> setModalState(true);
  const closeModal = ()=> setModalState(false)

  return(
    <div>
      <Button 
        onClick={openModal}
        className="bg-slate-700"
      >
        Internamento
      </Button>

      <Modal 
        title="Internamento"
        open={modalstate}
        onClose={closeModal}>

        <form>
          <div className="my-4">
            <InputDetails
              textLabel="Descrição"
              placeholder="Descreva"
              name="description"
              rows={3}
            />

            <InputField
              type="datetime-local"
              textLabel="Data e Hora"
              name="createdAt"
            />

            <InputField
              type="text"
              textLabel="Estado ao internar"
              placeholder="Estado antes do internamento"
              name="currentState"
            />
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button 
              cancel 
              type="button"
              onClick={closeModal}
              >Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}