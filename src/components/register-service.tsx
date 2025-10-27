"use client";

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback,
  useActionState 
} from "react";
import { toast } from "react-toastify";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import SpecialtyModal from "@/components/specialty-modal";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { 
  signCCG,
  getCCGs,
  signService,
} from "@/backend/api/clinical/scheduling-api";
import { getSpecialties } from "@/backend/api/clinical/api";
import { defaultServiceKinds } from "@/backend/api/clinical/translator";

export default function RegisterService(){
  const [ state, action ] = useActionState(signService, { message: "", status: false });
  const [ ccgState, ccgAction ] = useActionState(signCCG, { message: "", status: false });
  const [ groupModal, setGroupModal ] = useState(false);
  const toggleGroupModal = ()=>setGroupModal(!groupModal);

  // modal states
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ categoryState, setCategoryState ] = useState(false);
  const toggleCategory = ()=>setCategoryState(!categoryState);
  const [ classificationState, setClassificationState ] = useState(false);
  const toggleClassification = ()=>setClassificationState(!classificationState);

  const [ specialtyState, setSpecialtyState ] = useState(false);

  const [ groups, setGroups ] = useState<SelectionOption[]>([]);
  const [ categories, setCategories ] = useState<SelectionOption[]>([]);
  const [ classifications, setClassifications ] = useState<SelectionOption[]>([]);
  const [ specialties, setSpecialties ] = useState<SelectionOption[]>([]);
  const router = useRouter();
  const signFormRef = useRef<HTMLFormElement>(null);

  const handleSelect = useCallback(async ()=>{
    const categories = await getCCGs("category") as SelectionOption[];
    const groups = await getCCGs("group") as SelectionOption[];
    const classifications = await getCCGs("classification") as SelectionOption[];
    const specialties = await getSpecialties() as SelectionOption[];

    setGroups(groups);
    setCategories(categories);
    setClassifications(classifications);
    setSpecialties(specialties);
  }, []);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=>{
            router.refresh();
            signFormRef.current?.reset();
          }
        });
      else
        toast.error(state.message);

  }, [state, router]);

  useEffect(()=>{

    if(ccgState.message)
      if(ccgState.status)
        toast.success(ccgState.message, {
          onOpen: ()=>{
            router.refresh();
            setCategoryState(false);
            setClassificationState(false);
            setGroupModal(false);
          }
        });
      else
        toast.error(ccgState.message);
  }, [ccgState, router]);

  useEffect(()=>{
    handleSelect()
  }, [handleSelect]);

  return(
    <div>
      <Button onClick={openModal} className="flex gap-3">
        <PlusIcon className="w-5" />
        Cadastrar
      </Button>

      <Modal 
        title="Cadastrar Serviço"
        asWindow
        open={modalState}
        onClose={closeModal}>
        <form ref={signFormRef} {...{action}}>
          <InputField
            textLabel="Nome do Serviço" 
            placeholder="Descreva o nome do serviço"
            required
            name="name"
          />

          <Selection
            options={defaultServiceKinds}
            label="Tipo de Serviço"
            name="kindOfService"
            className="grow"
            onChange={e => setSpecialtyState(e.target.value === "consultation" ? true:false)}
            required
          />

          { specialtyState && <div className="flex gap-3 items-center">
            <Selection
              options={specialties}
              label="Especialidade"
              name="specialtyId"
              className="grow"
              onClick={handleSelect}
            />
            
            <SpecialtyModal shortWord />
          </div>}

          <div className="flex gap-3 items-center">
            <Selection
              options={categories}
              label="Categoria"
              required
              name="categoryId"
              className="grow"
              onClick={handleSelect}
            />
            <Button
              className="flex gap-x-1"  
              type="button" 
              onClick={toggleCategory}
            >
              <PlusIcon className="w-5" />
              Novo
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <Selection
              options={classifications}
              label="Classificação"
              required
              name="classificationId"
              className="grow"
              onClick={handleSelect}
            />
            <Button
              className="flex gap-x-1"  
              type="button" 
              onClick={toggleClassification}
            >
              <PlusIcon className="w-5" />
              Novo
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <Selection
              options={groups}
              label="Grupo"
              required
              name="groupId"
              className="grow"
              onClick={handleSelect}
            />
            <Button
              className="flex gap-x-1" 
              type="button" 
              onClick={toggleGroupModal}
            >
             <PlusIcon className="w-5" />
              Novo
            </Button>
          </div>
          
          <InputField
            textLabel="Preço"
            type="number"
            min={0}
            placeholder="Descreva o preço do serviço"
            name="price"
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={closeModal} 
              type="button" 
              cancel>Sair</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        title="Novo Grupo de Exames"
        open={groupModal}
        onClose={closeModal}>
        <form action={ccgAction}>
          <input type="hidden" name="type" value="group" />
          <InputField
            textLabel="Nome do Grupo" 
            placeholder="Descrição do nome do serviço"
            required
            name="name"
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={toggleGroupModal} 
              type="button" 
              cancel>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        title="Nova Categoria de serviço"
        open={categoryState}
        onClose={toggleCategory}>
        <form action={ccgAction}>
          <input type="hidden" name="type" value="category" />
          <InputField
            textLabel="Nome da Categoria" 
            placeholder="Descrição da categoria do exame"
            required
            name="name"
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={toggleCategory} 
              type="button" 
              cancel>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        title="Nova Classificação de serviço"
        open={classificationState}
        onClose={toggleClassification}>
        <form action={ccgAction}>
          <input type="hidden" name="type" value="classification" />
          <InputField
            textLabel="Nome da Classificação" 
            placeholder="Descrição da classificação do exame"
            required
            name="name"
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={toggleClassification} 
              type="button" 
              cancel>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}