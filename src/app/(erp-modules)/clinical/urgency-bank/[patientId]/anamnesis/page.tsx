import Button from "@/components/ui/button";
import { getPatient } from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";
// import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";
import ChildrenMedicine from "@/components/urgency-bank/anamnesis/childrens-medicine";
// import PediatricMedicine from "@/components/urgency-bank/anamnesis/pediatric-medicine";
// import PhisicalMedicine from "@/components/urgency-bank/anamnesis/phisical-medicine";
// import OphthalmologyService from "@/components/urgency-bank/anamnesis/ophthalmology-service";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { gender as genderTemplate } from "@/app/backend/api/clinical/translator";
import { updatePersonalInfo } from "@/app/backend/api/clinical/api";
import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";

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
			apiFn: updatePersonalInfo,
			initialState: { message: "", status: false },
			childrens: [
				{
					className: "flex justify-between",
					elements: [
						{ 
							type: "input",
							props: {
								label: "Nome completo",
								placeholder: "Nome completo do Utente",
								name: "fullname",
								defaultValue: fullname
							}
						},
						{ 
							type: "number",
							props: {
								label: "Idade",
								placeholder: "Idade do Utente",
								name: "age",
								defaultValue: age
							}
						},
						{
							type: "select",
							props: {
								label: "Gênero",
								name: "gender",
								options: genderTemplate,
								defaultValue: gender
							}
						}
					]
				}
			]
		},
		{
			title: "Queixa Principal",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Queixa Principal",
								rows: 3,
            		placeholder: "Descreva a principal queixa",
								name: "mainComplaint"
							}
						}
					]
				}
			]
		},
		{
			title: "História da Doênça Actual",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "História da Doênça Actual",
								rows: 3,
            		placeholder: "Descreva os sintomas actuais, duração, factores agravantes/aliviantes, entre outros",
								name: "symptoms"
							}
						}
					]
				}
			]
		},
		{
			title: "Exames Complementares",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Exames Complementares",
								rows: 3,
								placeholder: "Descrever os resultados dos exames, aspectos fundamentais observados",
								name: "complementaryExams"
							}
						}
					]
				}
			]
		},
		{
			title: "Hipótese de Diagnóstico",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Hipótese de Diagnóstico",
								rows: 3,
            		placeholder: "Descreva",
								name: "diagnosticHypothesis"
							}
						}
					]
				}
			]
		},
		{
			title: "Antecedentes Pessoais Patológicos(Doênças pré-existentes, hospitalizações, acidentes)",
			childrens: [
				{
					separatedElements: [
						{
							label: "Diabete",
							className: "flex gap-x-8 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Sim",
										name: "diabetes"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não",
										name: "diabetes"
									}
								},
							]
						},
						{
							label: "Hipertensão",
							className: "flex gap-3 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Sim",
										name: "hypertension"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não",
										name: "hypertension"
									}
								},
							]
						},
						{
							label: "Doênças Respiratórias",
							className: "flex gap-3 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Sim",
										name: "respiratoryDiseases"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não",
										name: "respiratoryDiseases"
									}
								},
							]
						},
						{
							label: "Tuberculose",
							className: "flex gap-3 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Sim",
										name: "tuberculosis"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não",
										name: "tuberculosis"
									}
								},
							]
						},
						{
							label: "Malária",
							className: "flex gap-3 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Sim",
										name: "malaria"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não",
										name: "malaria"
									}
								},
							]
						},
					],
					elements: []
				}
			]
		},
		{
			title: "Outros",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Outros",
								rows: 3,
            		placeholder: "Descreva",
								name: "others"
							}
						}
					]
				}
			]
		},
		{
			title: "Avaliação dos Orgãos Vitais",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Avaliação dos Orgãos Vitais",
								rows: 3,
            		placeholder: "Descreva",
								name: "signsOfVitalOrgans"
							}
						}
					]
				}
			]
		},
		{
			title: "Estilo de Vida e Hábitos",
			childrens: [
				{
					separatedElements: [
						{
							label: "Consumo de Tabaco",
							className: "flex gap-3 items-center",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Fumante",
										name: "tobaccoConsumption"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não fumante",
										name: "tobaccoConsumption"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Ex-fumante",
										name: "tobaccoConsumption"
									}
								},
							]
						},
						{
							label: "Consumo de Álcool",
							className: "flex gap-x-3 items-center flex-wrap",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Consome",
										name: "alcohol"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não consome",
										name: "alcohol"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Ex-consumidor",
										name: "alcohol"
									}
								},
								{ 
									type: "text",
									props: {
										label: "Frequência",
										placeholder: "Descreva",
										name: "frequency"
									}
								},
								{ 
									type: "number",
									props: {
										label: "Frequência",
										placeholder: "Digite o valor",
										name: "frequency"
									}
								},
							]
						},
						{
							label: "Actividade Física",
							className: "flex gap-x-3 items-center flex-wrap",
							elements: [
								{ 
									type: "radio",
									props: {
										label: "Praticante",
										name: "physical"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Não praticante",
										name: "physical"
									}
								},
								{ 
									type: "radio",
									props: {
										label: "Tipo de Actividade Física",
										name: "physical"
									}
								},
								{ 
									type: "text",
									props: {
										label: "quantidade",
										placeholder: "Descreva",
										name: "physicalAmount"
									}
								},
								{ 
									type: "text",
									props: {
										label: "Tempo de actividade por secção",
										placeholder: "Descreva",
										name: "upTime"
									}
								},
							]
						},
					],
					elements: []
				}
			]
		},
		{
			title: "Hábitos Alimentares",
			childrens: [
				{
					className: "grid grid-cols-2 gap-x-4",
					elements: [
						{ 
							type: "text",
							props: {
								label: "Nª de refeições/dia",
            		placeholder: "Descreva",
								name: "meals"
							}
						},
						{ 
							type: "text",
							props: {
								label: "Tipo de Alimento",
            		placeholder: "Descreva",
								name: "typeFood"
							}
						},
						{ 
							type: "text",
							props: {
								label: "Consumo de água/dia",
            		placeholder: "Descreva",
								name: "waterConsumption"
							}
						},
						{ 
							type: "text",
							props: {
								label: "Tipo/Modo de Tratamento da Água",
            		placeholder: "Descreva",
								name: "medicines"
							}
						},
					]
				}
			]
		},
		{
			title: "Antecedentes Familiares",
			childrens: [
				{
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Antecedentes Familiares",
								rows: 3,
            		placeholder: "Doênças na família como diabetes, hipertensão, câncer, doênças genéticas",
								name: "diseasesInTheFamily"
							}
						}
					]
				}
			]
		},
		{
			title: "Internamento",
			childrens: [
				{
					className: "flex flex-wrap",
					elements: [
						{ 
							type: "textarea",
							props: {
								label: "Motivo do internamento",
								rows: 3,
            		placeholder: "Descreva",
								name: "detail"
							}
						},
						{ 
							type: "date",
							props: {
								label: "Data do internamento",
								name: "dateOfAdmission"
							}
						},
						{ 
							type: "time",
							props: {
								label: "Horas",
								name: "hour"
							}
						},
						{ 
							type: "text",
							props: {
								label: "Estado ao Internar",
            		placeholder: "Descreva",
								name: "condition"
							}
						},
					]
				}
			]
		},
	];
	
  return(
		<main>
			<Button>Visualizar</Button>

			<div className="flex flex-col gap-y-5 my-8">
				<GlobalComponent
					title="CLINICA GERAL"
					components={components} 
				/>
				 
				{<GeralClinic 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}}
				/> }

      	<ChildrenMedicine 
					{...{_id}} 
					{...{fullname}} 
					{...{age}} 
					{...{gender}} 
				/>
			</div>
		</main>
	)
}
