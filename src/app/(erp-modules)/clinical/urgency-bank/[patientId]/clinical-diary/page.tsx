import ClinicalDiary, { type ClinicalDiaryProps } from "@/components/clinical-diary";

export default async function Page(){
	const clinicalItems: ClinicalDiaryProps[] = [
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "diary"
		},
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "annotation"
		},
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "balance"
		},
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "therapeutic"
		},
		{
			accordiumTitle: "Diário Médico",
			modalTitle: "Novo Diário Clínico",
			apiType: "vital"
		}
	];

  return(
		<main className="space-y-3">
			{ clinicalItems.map((item, index)=> <ClinicalDiary key={index} {...item} />) }
			
			{/* <div className="flex flex-col gap-y-5 my-8">
				<Accordium className="hover:bg-primary/35 bg-primary/40" title="Diário Clínico">
          Exemplo
				</Accordium>

        <Accordium className="hover:bg-primary/35 bg-primary/40" title="Diário Terapeutico">
          Exemplo
				</Accordium>

        <Accordium className="hover:bg-primary/35 bg-primary/40" title="Diário Tratamento">
          Exemplo
				</Accordium>

        <Accordium className="hover:bg-primary/35 bg-primary/40" title="Sinais Vitais">
          Exemplo
				</Accordium>

        <Accordium className="hover:bg-primary/35 bg-primary/40" title="Anotações Enfermagem">
          Exemplo
				</Accordium>

        <Accordium className="hover:bg-primary/35 bg-primary/40" title="Balanço Hidromineral">
          Exemplo
				</Accordium>
			</div> */}
		</main>
	)
}