import { 
	getTriedPatient,
	getPatientScreening, 
} from "@/app/backend/api/clinical/api";
import Accordium from "@/components/accordium";
import Button from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Priority } from "@/app/(erp-modules)/clinical/screening/[patientId]/priority/page";
import { 
  ReasonForm,
  VitalSignalsForm,
  PriorityForm,
  StatusForm,
  AdviceForm,
} from "@/components/forms/screening-forms";

export default async function Page({
  params
}:{
  params: Promise<{
    patientId: string;
  }>
}){
  const { patientId } = await params;
  const tried = await getTriedPatient(patientId);
  
  if(!tried)
    return redirect("/clinical/?invalid-patient");

  const reason = await getPatientScreening("reason", tried?.inScreeningId?.toString() as string) as { detail: string; };
  const vitalSignals = await getPatientScreening("vital signal", tried?.inScreeningId?.toString() as string);
  const priority = await getPatientScreening("priority", tried?.inScreeningId?.toString() as string) as Priority;
  const actualStatus = await getPatientScreening("status", tried?.inScreeningId?.toString() as string) as { detail: string; };
  const advice = await getPatientScreening("advice", tried?.inScreeningId?.toString() as string);

  return(
		<main>
			<Button>Visualizar</Button>

			<div className="flex flex-col gap-3 my-8">
				<Accordium title="Motivo da Vinda">
          {!!!reason ?
            <ReasonForm />:
            <ReasonForm 
              hasData
              jsonData={JSON.stringify(reason?.detail)} 
              screeningId={tried?.inScreeningId?.toString()}
            />
          }
				</Accordium>

				<Accordium title="Sinais Vitais">
          {
            !!vitalSignals?
            <VitalSignalsForm 
              hasData
              jsonData={JSON.stringify(vitalSignals)}
            />:
            <VitalSignalsForm />
          }
				</Accordium>

				<Accordium title="Grau de prioridade">
          {
            priority?
            <PriorityForm
              jsonData={JSON.stringify(priority)}
              hasData
            />:
            <PriorityForm />
          }
				</Accordium>
				<Accordium title="Estado Actual">
          {
            actualStatus?
            <StatusForm
              jsonData={JSON.stringify(actualStatus)}
              hasData 
            />:
            <StatusForm />
          }
				</Accordium>
				<Accordium title="Recomendações">
          {
            advice?
            <AdviceForm
              jsonData={JSON.stringify(advice)}
              hasData 
            />:
            <AdviceForm />
          }
				</Accordium>
			</div>
		</main>
	)
}