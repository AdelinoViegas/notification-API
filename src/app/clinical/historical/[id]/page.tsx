import Card from "@/components/ui/card";
import TitleAndSubtitle from "@/components/title-subtitle";
import Tag from "@/components/ui/tag";
import Accordium from "@/components/ui/accordium";
import { getPatientTransferHistories } from "@/backend/api/clinical/urgency-bank-api";
import Button from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params; 
  const transferData = await getPatientTransferHistories(id);
  
  return(
    <main className="space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/clinical/historical?r=t">
          <Button type="button" cancel className="flex items-center gap-2">
            <IoArrowBack className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card className="mb-8 pb-4">
         <div className="flex justify-between mt-3 mb-5">
            <TitleAndSubtitle
              label="Nome Completo"
              value={transferData[0]?.fullname}
              className = {{
                label:"border text-md font-medium bg-blue-100 text-primary px-3 py-1 rounded-full text-center w-[270px]",
                content: "font-medium text-gray-500 mt-1 ps-4"
              }} 
            />

            <TitleAndSubtitle
              label="Nº do processo"
              value={transferData[0]?.processNumber}
              className = {{
                label:"border text-md font-medium bg-blue-100 text-primary px-3 py-1 rounded-full text-center w-[270px]",
                content: "font-medium text-gray-500 mt-1 ps-4 text-center"
              }} 
            />
          </div>

          {
            transferData.map( (props) => (
              <Accordium extraClassName="mt-4 mb-6" title={`Transferência feita em ${props.transferDate}`} key={props.id}>
                <div className="grid lg:grid-cols-2">
                  <div>
                    <Tag className="inline-flex mt-1">Informações do Transferência</Tag>

                    <TitleAndSubtitle
                      label="Médico Responsável"
                      value={props.doctorResponsible} 
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }}
                    />

                    <TitleAndSubtitle
                      label="Serviço"
                      value={props.service}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />

                    <TitleAndSubtitle
                      label="Data de admissão"
                      value={props.admissionDate}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />

                    <TitleAndSubtitle
                      label="Data de transferência"
                      value={props.transferDate}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />

                    <TitleAndSubtitle
                      label="Unidade Externa"
                      value={props.unitExternal}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />

                    <TitleAndSubtitle
                      label="Motivo da transferência"
                      value={props.transferReason}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />
                  </div>
                  <div>                                                    
                    <Tag className="inline-flex mt-1">Razões da Transferência</Tag>
                    
                    <TitleAndSubtitle
                      label="Motivo da transferência"
                      value={props.transferReason}
                      className={{
                        label:"font-medium text-gray-500 ms-4",
                        content: "ms-6"
                      }} 
                    />
                  </div>
                </div>
              </Accordium>
            ))
          }

          <Button>Gerar PDF</Button>
        </Card>
      </div>
    </main>
  );
}
