import { getTransferedPatient } from "@/backend/api/clinical/api"
import Tag from "@/components/ui/tag";
import { getDataAndHoursFormat } from "@/lib/date-formater";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const transfer = await getTransferedPatient(id);
  return(
    <div>
      <div>
        <Tag className="inline-flex">Detalhes da Transferencia</Tag>
        <h2>Nome: {transfer?.patientName}</h2>
        
        <div>
          Motivo: {transfer?.reason}
        </div>

        <div>Unidade Externa: {transfer?.externalUnit.name}</div>
        <div>Data: {getDataAndHoursFormat(new Date(transfer?.createdAt as Date))}</div>
      </div>
    </div>
  )
}