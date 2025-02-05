import Button from "@/components/ui/button";
import ClinicalDiary from "@/components/clinical-diary";

export default async function Page(){

  return(
		<main>
			<ClinicalDiary 
				accordiumTitle="test"
				modalTitle="test"
				apiType="diary" 
			/>
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