"use client";

import { 
  useEffect,
  useState,
  useActionState 
} from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Selection, { SimpleSelectionType } from "@/components/ui/selection";
import Button from "@/components/ui/button";
import { updateExamService } from "@/app/backend/api/clinical/scheduling-api";
import Alert from "@/components/alert";
import SpecialtyModal from "@/components/specialty-modal";

type Exam = {
  _id: string;
  name: string;
  categoryId: string;
  groupId: string;
  classificationId: string;
  price: number;
  examCode: number;
  specialtyId?: string;
};

type ExamFormProps = {
  exam: string;
  groups: string;
  categories: string;
  classifications: string;
  specialties: string;
};

export default function ExamForm({
  exam,
  groups,
  categories,
  classifications,
  specialties
}: ExamFormProps){
  const [ state, action ] = useActionState(updateExamService, { message: "", status: false });
  const currentExam = JSON.parse(exam) as Exam;
  const _groups = JSON.parse(groups) as SimpleSelectionType[];
  const _categories = JSON.parse(categories) as SimpleSelectionType[];
  const _classifications = JSON.parse(classifications) as SimpleSelectionType[];
  const _specialties = JSON.parse(specialties) as SimpleSelectionType[];
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(()=>{
    setMessageState(true);
    if(state.message)
      setTimeout(()=>{
        setMessageState(false);

        if(state.status)
          router.replace("/clinical/exams-services");
      }, state.status?3000:5000);
  }, [state, router]);
  
  return(
    <div className="bg-white border rounded-xl px-8 py-4">
      <form className="w-96" {...{action}}>
        <input type="hidden" name="examId" value={params.examId} />
        
        <InputField
          textLabel="Código"
          disabled
          defaultValue={currentExam.examCode}
        />

        <InputField
          textLabel="Nome do exame/serviço" 
          placeholder="Descreva o nome"
          required
          name="name"
          defaultValue={currentExam.name}
        />

        <Selection
          label="Categoria"
          name="categoryId"
          required
          options={_categories}
          defaultValue={currentExam.categoryId}
        />

        <Selection
          label="Classificação"
          name="classificationId"
          required
          options={_classifications}
          defaultValue={currentExam.classificationId}
        />

        <Selection
          label="Grupo"
          name="groupId"
          required
          options={_groups}
          defaultValue={currentExam.groupId}
        />

        <div className="flex gap-3 items-center">
          <Selection
            options={_specialties}
            label="Especialidade"
            name="specialtyId"
            className="grow"
            defaultValue={currentExam?.specialtyId}
          />
          <SpecialtyModal />
        </div>
        <InputField
          textLabel="Preço" 
          type="number"
          placeholder="Preço do Exame/Serviço"
          name="price"
          defaultValue={currentExam.price}
        />

        <Button>Actualizar</Button>

        {
        state?.message && messageState &&
          <div className="flex mt-3">
            <Alert
              type={state?.status?'success':'error'}
              message={state?.message}
            />
          </div>
        }
      </form>
    </div>
  )
}