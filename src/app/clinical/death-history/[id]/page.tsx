import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import { Field } from "@/components/discharge-history/discharge-detail-view";
import Header from "@/components/header";
import { getDeceasedPatient } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params; 
  const deceasedPatient = await getDeceasedPatient(id);
  
  return(
    <main className="space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/clinical/historical?r=o">
          <Button type="button" cancel className="flex items-center gap-2">
            <IoArrowBack className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="my-4 text-center pt-3 text-white bg-gray-500 rounded-lg">
        <Header center title="Processo Bloqueado — Somente Leitura" />
      </div>
     
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {deceasedPatient.fullname}
              </h2>
              <p className="text-sm text-gray-500">
                Processo Nº {deceasedPatient.processNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                Bloqueado
              </span>
              {<Button>Gerar PDF</Button>}
            </div>
          </div>
    
          <div>
            <Tag className="inline-flex mb-3">Dados do Internamento</Tag>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Serviço de Internamento" value={deceasedPatient.service ?? "Desconhecido"} />
              <Field label="Enfermaria" value={deceasedPatient.nursing ?? "Desconhecido"} />
              <Field label="Nº da Cama/Leito" value={deceasedPatient.bed ?? "Desconhecido"} />
              <Field label="Data de Admissão" value={deceasedPatient.admissionDate ?? "Desconhecido"} />
            </div>
          </div>
    
          <div>
            <Tag className="inline-flex mb-3">Dados do Falecimento</Tag>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Data do Falecimento" value={deceasedPatient.dateOfDeath} />
              <Field label="Médico Responsável" value={deceasedPatient.doctorResponsible} />
              <Field
                label="Diagnóstico de Admissão"
                value={"desconhecido"}
                fullWidth
              />

              <Field
                label="Causas do Falecimento"
                value={deceasedPatient.reasonOfDeath}
                fullWidth
              />
            </div>
          </div>
    
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
            <svg className="size-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Processo bloqueado — Modo somente leitura. Não é possível editar registos de altas.
          </div>
        </div>
      </Card>
    </main>
  );
}
