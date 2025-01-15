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
import { personalInternalComponent } from "@/lib/internal-components";

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

  const personalData = personalInternalComponent({
		elements: [
			{ defaultValue: fullname },
			{ defaultValue: age },
			{ defaultValue: gender }
		]
	});
	
	const symptoms = {
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
							name: "symptoms"
						}
					}
				]
			}
		]
	}

	const diseaseData = {
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
							name: "diseaseData"
						}
					}
				]
			}
		]
	}

	const complementaryExams = {
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
	}
  
	const diagnostic =	{
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
	}

	const diseases = {
		title: "Antecedentes Pessoais Patológicos(Doênças pré-existentes, hospitalizações, acidentes)",
		childrens: [
			{
				separatedElements: [
					{
						label: "Diabete",
						className: "flex gap-x-3 items-center",
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
				],elements : []
			},
			{ 
				separatedElements: [
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
					}
				],elements : []
			},
			{
				separatedElements: [
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
					}
				],elements: []
			},
			{
				separatedElements: [
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
					}
				],elements: []
			},
			{
				separatedElements: [
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
					}
				],elements: []
			},
		]
	}
 
  const others = {
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
	}

	const evaluation = {
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
	}

	const lifeStyle:InternalComponent = {
		title: "Estilo de Vida e Hábitos",
		childrens: [
			{ 
				className: "my-6",
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
				],
				elements: []
			},
			{
				className:"grid grid-cols-2 gap-x-5", 
				separatedElements: [
					{
						label: "Consumo de Álcool",
						className: "flex items-center gap-x-4 row-span-1 col-span-2",
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
						]
					},
				],
				elements: []
			},
			{
				className: "grid grid-cols-2 gap-3",
				elements: [
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
							label: "Quantidade",
							placeholder: "Digite o valor",
							name: "alcoholAmount"
						}
					},
				]
			},
			{
				className:"grid grid-cols-2 gap-x-5 my-6", 
				separatedElements: [
					{
						label: "Actividade Física",
						className: "flex items-center gap-x-4 row-span-1 col-span-2",
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
							}
						]
					}
				],elements: [
					{ 
						type: "text",
						props: {
							label: "Quantidade",
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
			}
		]
	}

	const eatingHabits = {
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
	}

	const familyHistory = {
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
	}

	const hospitalization = {
		title: "Internamento",
		className: "grid",
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							name: "description",
							label: "Descrição",
							rows: 3
						}
					}
				]
			},
			{
				className: "grid lg:grid-cols-2 gap-3",
				elements: [
					{
						type: "datetime-local",
						props: {
							label: "Data e Hora",
							name: "createAt"
						}
					},
					{
						type: "input",
						props: {
							label: "Estado ao Internar",
							name: "currentState",
							placeholder: "Estado antes do internamento"
						}
					}
				]
			}
		]
	}

	const generalClinical:InternalComponent[] = [
		personalData,
		symptoms,
		diseaseData,
		complementaryExams,
		diagnostic,
		diseases,
		others,
		evaluation,
		lifeStyle,
		eatingHabits,
		familyHistory,
		hospitalization
	];
	
  return(
		<main>
			<Button>Visualizar</Button>

			<div className="flex flex-col gap-y-5 my-8">
				<GlobalComponent
					title="CLINICA GERAL"
					components={generalClinical} 
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
