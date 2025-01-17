import { updatePersonalInfo } from "@/app/backend/api/clinical/api";
import { gender as genderTemplate } from "@/app/backend/api/clinical/translator";
import { signUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";

type Personal = {
  elements: [
    { defaultValue: string },
    { defaultValue: number },
    { defaultValue: string },
  ];
};

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
							name: "signsOfVitalOrgans",
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
		apiFn: updatePersonalInfo,
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
							name: "activity"
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
							name: "upTime"
						}
					},
				]
			}
		]
	}
}

function eatingHabitsInternalComponent(){
	return {
		title: "Hábitos Alimentares",
		apiFn: updatePersonalInfo,
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
}

function familyInternalComponent(/*{ defaultValue }: { defaultValue: string}*/){
	return {
		title: "Antecedentes Familiares",
		apiFn: updatePersonalInfo,
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
							name: "famdiseasesInFamily"
						}
					}
				]
			}
		]
	}
}

function hospitalizationInternalComponent(){
	return {
		title: "Internamento",
		apiFn: updatePersonalInfo,
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