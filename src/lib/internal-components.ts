import { updatePersonalInfo } from "@/app/backend/api/clinical/api";
import { gender as genderTemplate } from "@/app/backend/api/clinical/translator";
import { signUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import { getDataToInputLocalTime } from "@/lib/date-formater";

type Personal = {
  elements: [
    { defaultValue: string },
    { defaultValue: number },
    { defaultValue: string },
  ];
};

type EatingHabits = {
	meals?: string,
	typeFood?: string,
	waterConsumption?: string,
	typeWater?: string,
}

type Hospitalization = {
	description?: string,
	dateTime?: Date,
	currentState?: string,
}

// type Diseases = {
// 	diabetes?: boolean,
// 	hypertension?: boolean,
// 	respiratoryDiseases?: boolean,
// 	tuberculosis?: boolean,
// 	malaria?: boolean,
// }

function personalInternalComponent({ elements }: Personal){
  return {
		title: "Dados Pessoais",
		apiFn: updatePersonalInfo,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-3 gap-3",
				elements: [
					{ 
						type: "input",
						props: {
							label: "Nome completo",
							placeholder: "Nome completo do Utente",
							name: "fullname",
							defaultValue: elements[0].defaultValue
						}
					},
					{ 
						type: "number",
						props: {
							label: "Idade",
							placeholder: "Idade do Utente",
							name: "age",
							defaultValue: elements[1].defaultValue
						}
					},
					{
						type: "select",
						props: {
							label: "Gênero",
							name: "gender",
							options: genderTemplate,
							defaultValue: elements[2].defaultValue
						}
					}
				]
			}
		]
	}
}

function symptomsInternalComponent(defaultValue?: string){
  return {
		title: "Queixa Principal",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Queixa Principal",
							rows: 3,
							placeholder: "Descreva a principal queixa",
							name: "symptoms",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function diseaseDataInternalComponent(defaultValue?: string){
  return {
		title: "História da Doênça Actual",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "História da Doênça Actual",
							rows: 3,
							placeholder: "Descreva os sintomas actuais, duração, factores agravantes/aliviantes, entre outros",
							name: "diseaseData",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function examsInternalComponent(defaultValue: string){
  return {
		title: "Exames Complementares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Exames Complementares",
							rows: 3,
							placeholder: "Descrever os resultados dos exames, aspectos fundamentais observados",
							name: "complementaryExams",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function diagnosticInternalComponent(defaultValue: string){
  return {
		title: "Hipótese de Diagnóstico",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Hipótese de Diagnóstico",
							rows: 3,
							placeholder: "Descreva",
							name: "diagnosticHypothesis",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function diseasesInternalComponent(){
  return {
		title: "Antecedentes Pessoais Patológicos(Doênças pré-existentes, hospitalizações, acidentes)",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
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
									name: "diabetes",
									value: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "diabetes",
									value: false
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
									name: "hypertension",
									value: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "hypertension",
									value: false
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
									name: "respiratoryDiseases",
									value: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "respiratoryDiseases",
									value: false
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
									name: "tuberculosis",
									value: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "tuberculosis",
									value: false
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
									name: "malaria",
									value: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "malaria",
									value: false
								}
							},
						]
					}
				],elements: []
			},
		]
	}
}

function othersInternalComponent(defaultValue?: string){
	return {
		title: "Outros",
		apiFn:	signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Outros",
							rows: 3,
							placeholder: "Descreva",
							name: "others",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function evaluationInternalComponent(defaultValue?: string){
	return {
		title: "Avaliação dos Orgãos Vitais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Avaliação dos Orgãos Vitais",
							rows: 3,
							placeholder: "Descreva",
							name: "evaluation",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function lifeStyleInternalComponent(){
	return {
		title: "Estilo de Vida e Hábitos",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{ 
				className: "mb-8",
				separatedElements: [
					{
						label: "Consumo de Tabaco",
						className: "flex gap-3 items-center",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Fumante",
									name: "tobaccoConsumption",
									value: "smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não fumante",
									name: "tobaccoConsumption",
									value: "non-smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Ex-fumante",
									name: "tobaccoConsumption",
									value: "Ex-smoker"
								}
							},
						]
					},
				],
				elements: []
			},
			{ 
				className: "mt-8 mb-[-30px]",
				separatedElements: [
					{
						label: "Consumo de Álcool",
						className: "flex items-center gap-x-4 row-span-1 col-span-2",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Consome",
									name: "alcoholConsumption",
									value: "Consume"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não consome",
									name: "alcoholConsumption",
									value: "doesn't-consume"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Ex-consumidor",
									name: "alcoholConsumption",
									value: "ex-consumer"
								}
							},
						]
					},
				],
				elements: []
			},
			{
				className: "grid grid-cols-2 gap-x-3 mb-8",
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
				className:"grid grid-cols-2 gap-x-5 mt-8 mb-[-10px]", 
				separatedElements: [
					{
						label: "Actividade Física",
						className: "flex items-center gap-x-4 row-span-1 col-span-2",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Praticante",
									name: "exercise",
									value: "practitioner"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não praticante",
									name: "exercise",
									value: "non-practitioner"
								}
							},
						]
					}
				],elements: []
			},
			{ 
				className:"grid grid-cols-3 gap-x-3",
				elements: [
					{ 
						type: "text",
						props: {
							label: "Tipo de Actividade Física",
							placeholder: "Descreva",
							name: "type"
						}
					},
					{ 
						type: "number",
						props: {
							label: "Quantidade",
							placeholder: "Digite o valor",
							name: "physicalAmount"
						}
					},
					{ 
						type: "text",
						props: {
							label: "Tempo de actividade por secção",
							placeholder: "Descreva",
							name: "time"
						}
					},
				]
			}
		]
	}
}

function eatingHabitsInternalComponent(eatingHabits: EatingHabits){
	return {
		title: "Hábitos Alimentares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-2 gap-x-4",
				elements: [
					{ 
						type: "text",
						props: {
							label: "Nª de refeições/dia",
							placeholder: "Descreva",
							name: "meals",
							defaultValue: eatingHabits.meals
						}
					},
					{ 
						type: "text",
						props: {
							label: "Tipo de Alimento",
							placeholder: "Descreva",
							name: "typeFood",
							defaultValue: eatingHabits.typeFood
						}
					},
					{ 
						type: "text",
						props: {
							label: "Consumo de água/dia",
							placeholder: "Descreva",
							name: "waterConsumption",
							defaultValue: eatingHabits.waterConsumption
						}
					},
					{ 
						type: "text",
						props: {
							label: "Tipo/Modo de Tratamento da Água",
							placeholder: "Descreva",
							name: "typeWater",
							defaultValue: eatingHabits.typeWater
						}
					},
				]
			}
		]
	}
}

function familyInternalComponent(defaultValue: string){
	return {
		title: "Antecedentes Familiares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Antecedentes Familiares",
							rows: 3,
							placeholder: "Doênças na família como diabetes, hipertensão, câncer, doênças genéticas",
							name: "diseasesInFamily",
							defaultValue: defaultValue
						}
					}
				]
			}
		]
	}
}

function hospitalizationInternalComponent(hospitalization: Hospitalization){
	return {
		title: "Internamento",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		className: "grid",
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							name: "description",
							label: "Descrição",
							rows: 3,
							defaultValue: hospitalization.description
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
							name: "createdAt",
							defaultValue: hospitalization.dateTime?getDataToInputLocalTime(hospitalization.dateTime):undefined
						}
					},
					{
						type: "input",
						props: {
							label: "Estado ao Internar",
							name: "currentState",
							placeholder: "Estado antes do internamento",
							defaultValue: hospitalization.currentState
						}
					}
				]
			}
		]
	}
}

export {
  personalInternalComponent,
	symptomsInternalComponent,
	diseaseDataInternalComponent,
  examsInternalComponent,
	diagnosticInternalComponent,
	diseasesInternalComponent,
	othersInternalComponent,
	evaluationInternalComponent,
	lifeStyleInternalComponent,
	eatingHabitsInternalComponent,
	familyInternalComponent,
	hospitalizationInternalComponent
}