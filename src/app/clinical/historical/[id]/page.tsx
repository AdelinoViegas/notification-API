import { GoAlertFill } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import Header from "@/components/header";
import { Field } from "@/components/discharge-history/discharge-detail-view";
import { getPatientTransferHistories } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params; 
  const transferData = await getPatientTransferHistories(id);
  
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
           <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {transferData[0].fullname}
              </h2>
              <p className="text-sm text-gray-500">
                Processo Nº {transferData[0].processNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                Bloqueado
              </span>
              {<Button>Gerar PDF</Button>}
            </div>
          </div>

          {
            transferData.map( (props) => (
              <Accordium extraClassName="mt-4 mb-6" title={`Transferência feita em ${props.transferDate}`} key={props.id}>
                <div className="space-y-6">
                  <div>
                    <Tag className="inline-flex mb-3">Dados do Internamento</Tag>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Serviço de Internamento" value={props.service ?? "Desconhecido"} />
                      <Field label="Data de Admissão" value={ "Desconhecido"} />
                    </div>
                  </div>
            
                  <div>
                    <Tag className="inline-flex mb-3">Dados da Transferência</Tag>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Data da Transferência" value={props.transferDate ?? "Desconhecido"} />
                      <Field label="Médico Responsável" value={props.doctorResponsible ?? "Desconhecido"} />
                      <Field label="Diagnóstico de Admissão"  value={ "desconhecido"}/>
                      <Field label="Unidade Externa" value={ props.unitExternal ?? "Desconhecido"}/>

                      <Field
                        label="Motivo da Transferência"
                        value={props.transferReason ?? "Desconhecido"}
                        fullWidth
                      />
                    </div>
                  </div>
            
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
                    <GoAlertFill size={20} />
                    Processo bloqueado — Modo somente leitura. Não é possível editar registos de altas.
                  </div>
                </div>
              </Accordium>
            ))
          }

          <Button>Gerar PDF</Button>
      </Card>
    </main>
  );
}
