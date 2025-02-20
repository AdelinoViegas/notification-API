import ClinicalDiary, { type ClinicalDiaryProps } from "@/components/clinical-diary";

export default async function Page({
	params 
}:{ 
	params : Promise<{
		patientId: string
	}>
}){
	const { patientId } = await params;

	const clinicalItems: ClinicalDiaryProps[] = [
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "diary",
			patientId,
		},
		{
			accordiumTitle: "Diário Terapéutico",
			modalTitle: "Novo Diário Clínico",
			apiType: "therapeutic",
			patientId,
		},
		{
			accordiumTitle: "Diário Tratamento",
			modalTitle: "Novo Diário Clínico",
			apiType: "treatment",
			patientId,
		},
		{
			accordiumTitle: "Sinais Vitais",
			modalTitle: "Novo Diário Clínico",
			apiType: "vital",
			patientId,
		},
		{
			accordiumTitle: "Anotações Enfermagem",
			modalTitle: "Novo Diário Clínico",
			apiType: "annotation",
			patientId,
		},
		{
			accordiumTitle: "Balanço Hidromineral",
			modalTitle: "Novo Diário Clínico",
			apiType: "balance",
			patientId,
		},
	];
	
  return(
		<main className="space-y-3 mt-6">
			{ clinicalItems.map((item, index)=> <ClinicalDiary  key={index} {...item} />) }
		</main>
	)
}