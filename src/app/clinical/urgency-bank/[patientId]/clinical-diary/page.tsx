import ClinicalDiary, { type ClinicalDiaryProps } from "@/components/clinical-diary";
import { getPatientUrgencyBank } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({
	params 
}:{ 
	params : Promise<{
		patientId: string
	}>
}){
	const { patientId } = await params;
	const { clinicalDiary } = await getPatientUrgencyBank(patientId);

	const clinicalItems: ClinicalDiaryProps[] = [
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "diary",
			patientId,
			columns: ["Data-Hora", "Descrição"],
			dataDiary: { medicineDiary: clinicalDiary.medicinelDiary },
		},
		{
			accordiumTitle: "Diário Terapéutico",
			modalTitle: "Novo Diário Terapéutico",
			apiType: "therapeutic",
			patientId,
		    columns: ["Data-Hora", "assinatura", "Descrição"],
			dataDiary: { therapeuticDiary: clinicalDiary.therapeuticDiary}
		},
		{
			accordiumTitle: "Diário Tratamento",
			modalTitle: "Novo Diário Tratamento",
			apiType: "treatment",
			patientId,
		    columns: ["Data-Hora", "assinatura", "Descrição"],
		    dataDiary: { treatmentDiary: clinicalDiary.treatmentDiary}
		},
		{
			accordiumTitle: "Sinais Vitais",
			modalTitle: "Novos Sinais Vitais",
			apiType: "vital",
			patientId,
			columns: ["Data-Hora","Descrição","pM","pm","BPM","pvc","imc","sp02","(°)","IRPM","(kg)","(m)","(mg/dl)"],
			dataDiary: { vitalSignals: clinicalDiary.vitalSignals}
		},
		{
			accordiumTitle: "Anotações de Enfermagem",
			modalTitle: "Novas Anotações de Enfermagem",
			apiType: "annotation",
			patientId,
			columns: ["Data-Hora", "Descrição"],
			dataDiary: { nursingNotes: clinicalDiary.nursingNotes}
		},
		{
			accordiumTitle: "Balanço Hidromineral",
			modalTitle: "Novo Balanço Hidromineral",
			apiType: "balance",
			patientId,
		    columns: ["Data-Hora","via","Qtd","Bal-Hidromineral", "Descrição"],
		    dataDiary: { hydromineralBalance: clinicalDiary.hydromineralBalance}
		},
	];
	
  return(
		<main className="space-y-3 mt-6">
			{ clinicalItems.map((item, index)=> <ClinicalDiary  key={index} {...item} />) }
		</main>
	)
}