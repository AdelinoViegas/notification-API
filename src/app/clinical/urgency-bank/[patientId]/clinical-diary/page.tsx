import ClinicalDiary, { type ClinicalDiaryProps } from "@/components/clinical-diary";

const clinicalItems: ClinicalDiaryProps[] = [
	{
		accordiumTitle: "Diário Médico",
		modalTitle: "Novo Diário Clínico",
		apiType: "diary"
	},
	{
		accordiumTitle: "Diário Terapéutico",
		modalTitle: "Novo Diário Clínico",
		apiType: "annotation"
	},
	{
		accordiumTitle: "Diário Tratamento",
		modalTitle: "Novo Diário Clínico",
		apiType: "balance"
	},
	{
		accordiumTitle: "Sinais Vitais",
		modalTitle: "Novo Diário Clínico",
		apiType: "therapeutic"
	},
	{
		accordiumTitle: "Anotações Enfermagem",
		modalTitle: "Novo Diário Clínico",
		apiType: "vital"
	},
	{
		accordiumTitle: "Balanço Hidromineral",
		modalTitle: "Novo Diário Clínico",
		apiType: "vital"
	},
];

export default async function Page(){
  return(
		<main className="space-y-3">
			{ clinicalItems.map((item, index)=> <ClinicalDiary key={index} {...item} />) }
		</main>
	)
}