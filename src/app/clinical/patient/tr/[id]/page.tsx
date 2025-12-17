import { getTransferedPatient } from "@/backend/api/clinical/api"

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const transfer = await getTransferedPatient(id);
  return(
    <div>
      <pre>{JSON.stringify(transfer, null, 2)}</pre>
    </div>
  )
}