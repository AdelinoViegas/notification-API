import { signUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import { InternalComponent } from "@/components/global-component";

type EatingHabits = {
	meals?: string,
	typeFood?: string,
	waterConsumption?: string,
	typeWater?: string,
}

type Diseases = {
	diabetes: boolean,
	hypertension: boolean,
	respirationDiseases: boolean,
	tuberculosis: boolean,
	malaria: boolean,
}

type LifeStyle = {
	tabaccoConsumption: string,
	alcoholConsumption: {
		alcohol: string,
		frequency: string,
		amount: number,      
	},
	physicalActivity: {
		exercise: string,
		type: string,
		amount: number,
		timeExercise: string,      
	},
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

function diseaseInGeneralClinicComponent(defaultValue?: string){
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
		title: "Hipótese de Diagnóstico (CID)",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements:[
					{ 
						type: "combobox",
						props: {
							label: "Código/Nome da CID 10",
							placeholder: "Digite o código ou a discrição da CID...",
							name: "CID",
							defaultValue
						}
					}
				]
			}
		]
	}
}

function diseasesInternalComponent(diseases: Diseases){
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
									defaultChecked: diseases.diabetes,
									defaultValue: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "diabetes",
									defaultChecked: !(diseases.diabetes === null) && !diseases.diabetes,
									defaultValue: false
								}
							},
						]
					},
				],elements : [],
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
									defaultChecked: diseases.hypertension,
									defaultValue: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "hypertension",
									defaultChecked: !(diseases.hypertension === null) && diseases.hypertension,
									defaultValue: false
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
									defaultChecked: diseases.respirationDiseases,
									defaultValue: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "respiratoryDiseases",
									defaultChecked: !(diseases.respirationDiseases === null) && !diseases.respirationDiseases,
									defaultValue: false							
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
									defaultChecked: diseases.tuberculosis,
									defaultValue: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "tuberculosis",
									defaultChecked: !(diseases.tuberculosis === null) && !diseases.tuberculosis,
									defaultValue: false
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
									defaultChecked: diseases.malaria,
									defaultValue: true
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "malaria",
									defaultChecked: !(diseases.malaria === null) && !diseases.malaria,
									defaultValue: false
								}
							},
						]
					}
				],elements: []
			},
		]
	}
}

function othersComponent(defaultValue?: string){
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

function lifeStyleInternalComponent(lifeStyle: LifeStyle){
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
									name: "tabaccoConsumption",
									defaultChecked: lifeStyle.tabaccoConsumption === "smoker",
									defaultValue: "smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não fumante",
									name: "tabaccoConsumption",
									defaultChecked: lifeStyle.tabaccoConsumption === "non-smoker",
									defaultValue: "non-smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Ex-fumante",
									name: "tabaccoConsumption",
									defaultChecked: lifeStyle.tabaccoConsumption === "ex-smoker",
									defaultValue: "ex-smoker"
								}
							},
						]
					},
				],
				elements: []
			},
			{ 
				separatedElements: [
					{
						label: "Consumo de Álcool",
						className: "flex items-center gap-x-2",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Consome",
									name: "alcoholConsumption",
									defaultChecked: lifeStyle.alcoholConsumption.alcohol === "consume",
									defaultValue: "consume"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não consome",
									name: "alcoholConsumption",
									defaultChecked: lifeStyle.alcoholConsumption.alcohol === "doesn't-consume",
									defaultValue: "doesn't-consume"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Ex-consumidor",
									name: "alcoholConsumption",
									defaultChecked: lifeStyle.alcoholConsumption.alcohol === "ex-consumer",
									defaultValue: "ex-consumer"
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
							name: "frequency",
							defaultValue: lifeStyle.alcoholConsumption.frequency
						}
					},
					{ 
						type: "number",
						props: {
							label: "Quantidade",
							placeholder: "Digite o valor",
							name: "alcoholAmount",
							defaultValue: lifeStyle.alcoholConsumption.amount
						}
					},
				]
			},
			{ 
				separatedElements: [
					{
						label: "Actividade Física",
						className: "flex items-center gap-x-2",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Praticante",
									name: "exercise",
									defaultChecked: lifeStyle.physicalActivity.exercise === "practitioner",
									defaultValue: "practitioner"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não praticante",
									name: "exercise",
									defaultChecked: lifeStyle.physicalActivity.exercise === "non-practitioner",
									defaultValue: "non-practitioner"
								}
							},
						]
					}
				],elements: []
			},
			{ 
				className:"grid grid-cols-2 gap-x-3",
				elements: [
					{ 
						type: "text",
						props: {
							label: "Tipo de Actividade Física",
							placeholder: "Descreva",
							name: "type",
							defaultValue: lifeStyle.physicalActivity.type
						}
					},
					{ 
						type: "number",
						props: {
							label: "Quantidade",
							placeholder: "Digite o valor",
							name: "physicalAmount",
							defaultValue: lifeStyle.physicalActivity.amount
						}
					},
					{ 
						type: "text",
						props: {
							label: "Tempo de actividade por secção",
							placeholder: "Descreva",
							name: "time",
							defaultValue: lifeStyle.physicalActivity.timeExercise
						}
					},
				]
			}
		]
	}
}

function eatingHabitsInternalComponent(eatingHabits: EatingHabits): InternalComponent {
	return {
		title: "Hábitos Alimentares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-2 gap-x-3",
				elements: [
					{ 
						type: "text",
						props: {
							label: "Nº de refeições/dia",
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

export {
	symptomsInternalComponent,
	diseaseInGeneralClinicComponent,
  examsInternalComponent,
	diagnosticInternalComponent,
	diseasesInternalComponent,
	othersComponent,
	evaluationInternalComponent,
	lifeStyleInternalComponent,
	eatingHabitsInternalComponent,
	familyInternalComponent,
}
