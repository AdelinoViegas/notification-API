import Button from "@/components/ui/button";
import { getPatient } from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";
import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";
import ChildrenMedicine from "@/components/urgency-bank/anamnesis/childrens-medicine";
import PediatricMedicine from "@/components/urgency-bank/anamnesis/pediatric-medicine";
import PhisicalMedicine from "@/components/urgency-bank/anamnesis/phisical-medicine";
import OphthalmologyService from "@/components/urgency-bank/anamnesis/ophthalmology-service";
import GlobalComponent, { InternalComponent } from "@/components/global-component";

async function ExampleApi(prev:unknown, formData: FormData){
	"use server";

	console.log(formData);

	return {
		message: "hello world",
		status: true,
	}
}

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
	
	const components:InternalComponent[] = [
		{
			title: "Dados Pessoais",
			apiFn: ExampleApi,
			initialState: { message: "", status: false },
			childrens: [
				{
					className: "grid lg:grid-cols-3 lg:gap-3",
					sectionElements: [
						{ 
							type: "input",
							props: {
								label: "Nome completo",
								placeholder: "Nome completo do Utente",
								name: "fullname"
							}
						},
						{ 
							type: "input",
							props: {
								label: "Idade",
								placeholder: "Idade do Utente",
								name: "age"
							}
						},
						{
							type: "select",
							props: {
								label: "Gênero",
								name: "gender"
							}
						}
					]
				}
			]
		},
		{
			title: "Avaliação da Gestação Actual",
			apiFn: ExampleApi,
			initialState: { message: "", status: false },
			childrens: [
				{
					className: "grid lg:grid-cols-3 lg:gap-3",
					sectionElements: [
						{ 
							type: "date",
							props: {
								label: "Data",
								placeholder: "Data",
								name: "date"
							}
						}
					]
				}
			]
		}
	];
	
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
