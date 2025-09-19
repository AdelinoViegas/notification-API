"use client";

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback,
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Alert from "@/components/ui/alert";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { 
  signExam, 
  signCCG,
  getCCGs,
} from "@/backend/api/clinical/scheduling-api";
import { getSpecialties } from "@/backend/api/clinical/api";
import SpecialtyModal from "@/components/specialty-modal";

export default function SignExam(){
  const [ state, action ] = useActionState(signExam, { message: "", status: false });
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
  // end of modal states
  const [ messageState, setMessageState ] = useState(false);
  const [ ccgMessageState, setCCGMessageState ] = useState(false);
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
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          router.refresh();
          signFormRef.current?.reset();
        }
        setMessageState(false);
      }, 2000);
    }
  }, [state, router]);

  useEffect(()=>{
    if(ccgState.message){
      setCCGMessageState(true);

      setTimeout(()=>{
        if(ccgState.status){
          router.refresh();
          setCategoryState(false);
          setClassificationState(false);
          setGroupModal(false);
        }
        setCCGMessageState(false);
      }, 2000);
    }
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
        title="Novo Grupo de Exames"
        open={groupModal}
        onClose={closeModal}>
        <form action={ccgAction}>
          <input type="hidden" name="type" value="group" />
          <InputField
            textLabel="Nome do Grupo" 
            placeholder="Descrição do nome do exame"
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
        
        { ccgMessageState &&
          <div className="mt-3">
            <Alert
              message={ccgState.message}
              type={ccgState.status?"success":"error"} 
            /> 
          </div>
        }
      </Modal>

      <Modal 
        title="Nova Categoria de Exames"
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

        { ccgMessageState &&
          <div className="mt-3">
            <Alert
              message={ccgState.message}
              type={ccgState.status?"success":"error"} 
            /> 
          </div>
        }
      </Modal>

      <Modal 
        title="Nova Classificação de Exames"
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
        { ccgMessageState &&
          <div className="mt-3">
            <Alert
              message={ccgState.message}
              type={ccgState.status?"success":"error"} 
            /> 
          </div>
        }
      </Modal>

      <Modal 
        title="Cadastrar Exame/Serviço"
        open={modalState}
        onClose={closeModal}>
        <form ref={signFormRef} {...{action}}>
          <InputField
            textLabel="Descrição" 
            placeholder="Descrição do nome do exame"
            required
            name="name"
          />

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

          <div className="flex gap-3 items-center">
            <Selection
              options={specialties}
              label="Especialidade"
              name="specialtyId"
              className="grow"
              onClick={handleSelect}
            />
            
            <SpecialtyModal isExamServices/>
          </div>
          
          <InputField
            textLabel="Preço"
            type="number"
            min={0}
            placeholder="Descreva o preço do exame"
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

        { messageState &&
          <div className="mt-3">
            <Alert
              message={state.message}
              type={state.status?"success":"error"} 
            /> 
          </div>
        }
      </Modal>
    </div>
  )
}