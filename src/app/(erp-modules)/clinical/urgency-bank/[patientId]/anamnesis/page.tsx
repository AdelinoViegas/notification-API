import Button from "@/components/ui/button";
import { getPatient } from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";
import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";
import ChildrenMedicine from "@/components/urgency-bank/anamnesis/childrens-medicine";
import PediatricMedicine from "@/components/urgency-bank/anamnesis/pediatric-medicine";
import PhisicalMedicine from "@/components/urgency-bank/anamnesis/phisical-medicine";
import OphthalmologyService from "@/components/urgency-bank/anamnesis/ophthalmology-service";
import GlobalComponent, { InternalComponent } from "@/components/global-component";

export type patientData = {
	_id:string;
	fullname:string;
	age:number;
  gender:string;
}

export default async function Page({
	params,
}: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	const patient = await getPatient(patientId);
	if(!patient)
		redirect('/clinical?invalid-user');

	const { personal } = patient;
  const _id = String(personal._id);
	const fullname = String(personal.fullname);
	const age = Number(personal.age);
	const gender = String(personal.gender);
	
	const components:InternalComponent[] = [{
		title: "Queixa Principal",
		className: "grid grid-cols-3",
		childrens: [
			{
				sectionElements: [
					{ 
						type: "input",
						props: {
							label: "test",
							placeholder: "test",
							name: "test"
						}
					}
				]
			}
		]
	}];
	
  return(
		<main>
			<Button>Visualizar</Button>

			<div className="flex flex-col gap-y-5 my-8">
				<GlobalComponent
					title="CLINICA GERAL"
					components={components} 
				/> 
				{/* <GeralClinic 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}}
				/> */}

      	<ChildrenMedicine 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}} 
				/>

        {/* <PediatricMedicine 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}}
				/>

				<PhisicalMedicine 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}}
				/>

        <OphthalmologyService 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}}
				/>  */}
			</div>
		</main>
	)
}
