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

function diagnosticInternalComponent(){
	return {
		title: "Hipótese de Diagnóstico",
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
							name: "CID"
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
									defaultChecked: !diseases.diabetes,
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
									defaultChecked: !diseases.hypertension,
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
									defaultChecked: !diseases.respirationDiseases,
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
									defaultChecked: !diseases.tuberculosis,
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
									defaultChecked: !diseases.malaria,
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
									name: "tobaccoConsumption",
									defaultChecked: lifeStyle.tabaccoConsumption === "smoker",
									defaultValue: "smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não fumante",
									name: "tobaccoConsumption",
									defaultChecked: lifeStyle.tabaccoConsumption === "non-smoker",
									defaultValue: "non-smoker"
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Ex-fumante",
									name: "tobaccoConsumption",
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
				className:"grid grid-cols-3 gap-x-3",
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

function gestationComponent(){
	return {
		title: "Avaliação da Gestão Actual",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-2 gap-x-4",
				elements: [
					{ 
						type: "date",
						props: {
							label: "Data da última menstrução",
							name: "lastPeriod",
						}
					},
					{ 
						type: "text",
						props: {
							label: "Tempo de atraso",
							placeholder: "Descreva",
							name: "time",
						}
					},
					{ 
						type: "number",
						props: {
							label: "Idade gestacional",
							placeholder: "digite a idade gestacional",
							name: "age",
						}
					},
					{ 
						type: "date",
						props: {
							label: "Data provável do parto",
							placeholder: "Descreva",
							name: "childbirth",
						}
					},
				]
			}
		]
	}
}

function symptomsComponent(){
	return {
		title: "Sinais e Sintómas Presentes",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{ 
						type: "textarea",
						props: {
							label: "Sinais e Sintómas Presentes",
							rows:3,
							placeholder: "náuseas, vómitos, dor abdominal, sangramentos, outros, duração",
							name: "signs",
						}
					},
				]
			}
		]
	};
}

function prenatalExamsComponent(){
	return {
		title: "Exames Pré-Natal",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{ 
				separatedElements: [
					{
						label: "Ecografia",
						className: "flex gap-3 items-center",
						elements: [
							{ 
								type: "radio",
								props: {
									label: "Sim",
									name: "ultrasound",
								}
							},
							{ 
								type: "radio",
								props: {
									label: "Não",
									name: "ultrasound",
								}
							},
						]
					},
				],elements: []
			},
			{ 
				className: "mb-40 w-96",
				elements: [
					{ 
						type: "text",
						props: {
							label: "Resultado",
							name: "resultExam",
						}
					},
				]
			},
			{ 
				className: "mt-20",
				separatedElements: [
					{
						label: "Exame de Sangue",
						className: "flex flex-col",
						elements: [
							{ 
								type: "checkbox",
								props: {
									label: "Hemograma",
									name: "bloodCount",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Glicemia",
									name: "bloodGlucose",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "VDR",
									name: "VDR",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "VIH",
									name: "VIH",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Hepatite-B",
									name: "hepatitis-b",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Falciformação",
									name: "sickleCell",
								}
							},
						]
					},
				],elements: []
			},
		]
	};
}


function diseaseCardioPulmunaryComponent(){
	return {
		title: "História da Doênça Actual(sinais e sintomas presentes)",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{ 
				separatedElements: [
					{
						label: "Sistema Cardiovascular",
						className: "flex flex-col",
						elements: [
							{ 
								type: "checkbox",
								props: {
									label: "Dor Torácica",
									name: "chestPain",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Palpitações",
									name: "palpitations",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Dispneia",
									name: "dyspnea",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Edema",
									name: "edema",
								}
							},
							{ 
								type: "checkbox",
								props: {
									label: "Síncope",
									name: "syncope",
								}
							},
						]
					},
				],elements: []
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Duração dos Sinais e Sintomas Cardiovascular",
							name: "durationOfSymptoms",
							rows: 3,
							placeholder: "Descreva",
						}
					}
				]
			},
			{
				separatedElements: [
					{
						className: "flex gap-x-2 items-center",
						label: "Sistema Respiratório",
						elements: [
							{
								type:"radio",
								props:{
									label: "Produtiva",
									name: "productivity"
								}
							},
							{
								type:"radio",
								props:{
									label: "Não Produtiva",
									name: "productivity"
								}
							},
						]
					}
				], elements: []
			},
			{ 
				className: "flex flex-col",
				elements: [
					{ 
						type: "checkbox",
						props: {
							label: "Tosse",
							name: "cough",
						}
					},
					{ 
						type: "checkbox",
						props: {
							label: "Chiado no Peito",
							name: "badBreath",
						}
					},
					{ 
						type: "checkbox",
						props: {
							label: "Hemoptise",
							name: "hemoptysis",
						}
					},
				]
			},
			{
				className: "flex gap-x-4",
				elements:[
					{
						type: "text",
						props:{
							label: "Dor Torácica Pleurítica",
							placeholder: "Descreva",
							name: "chestPain",
						}
					},
					{
						type: "text",
						props:{
							label: "Expectoração (características)",
							placeholder: "Descreva",
							name: "features",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Duração dos Sinais e Sintomas Respiratório",
							name: "durationOfSymptoms",
							rows: 3,
							placeholder: "Descreva"
						}
					}
				]
			}
		]
	};
}

function phisicalExamComponent(){
	return {
		title: "Exame Físico",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-3 items-center gap-x-2",
				elements:[
					{
						type: "text",
						props:{
							label: "Estado geral",
							placeholder: "Descreva",
							name: "generalCondition",
						}
					},
					{
						type: "text",
						props:{
							label: "Postura",
							placeholder: "Descreva",
							name: "posture",
						}
					},
					{
						type: "text",
						props:{
							label: "Clanose",
							placeholder: "Descreva",
							name: "clanosis",
						}
					},
					{
						type: "text",
						props:{
							label: "Edema",
							placeholder: "Descreva",
							name: "edema",
						}
					},
					{
						type: "text",
						props:{
							label: "Inspeção e palpação do precórdio",
							placeholder: "Descreva",
							name: "inspect",
						}
					},
					{
						type: "text",
						props:{
							label: "Ausculta Cardíaca",
							placeholder: "ritmo, sopros, bulhas",
							name: "cardiacAuscultation",
						}
					},
					{
						type: "text",
						props:{
							label: "Pulso",
							placeholder: "frequência, amplitude, ritmo",
							name: "pulse",
						}
					},
					{
						type: "text",
						props:{
							label: "Inspeção do tórax",
							placeholder: "simetria, defomidades",
							name: "chestInspection",
						}
					},
					{
						type: "text",
						props:{
							label: "Palpação",
							placeholder: "Descreva",
							name: "palpation",
						}
					},
					{
						type: "text",
						props:{
							label: "Percussão",
							placeholder: "Descreva",
							name: "percussion",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Ausculta Pulmonar",
							name: "pulmonaryAuscultation",
							rows: 3,
							placeholder: "Descreva"
						}
					}
				]
			}
		]
	};
}

function personalHistoryCardioPulmunaryComponent(){
  return {
		title: "Antecedentes Pessoais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
        separatedElements: [
					{
						label:"Doênças Prévias",
						elements: [
							{
								type:"checkbox",
								props:{
									label: "Hipertensão:",
									name: "hypertension"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Insuficiência Cardiáca:",
									name: "heartFailure"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Infarto:",
									name: "heartAttack"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Asma:",
									name: "asthma"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Tuberculose:",
									name: "tuberculosis"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "DPOC:",
									name: "dpoc"
								}
							},
						]
					}
				], elements: []
			},
			{ 
				className: "grid grid-cols-3 items-center gap-x-2",
				elements: [
					{
						type: "text",
						props: {
							label: "Outra",
							name: "OtherDiseases",
							placeholder: "Descreva"
						}
					},
					{
						type: "text",
						props: {
							label: "Cirurgia Pré-existente",
							name: "surgeries",
							placeholder: "Descreva"
						}
					},
					{
						type: "date",
						props: {
							label: "Data da Cirurgia",
							name: "surgeryDate",
							placeholder: "Descreva"
						}
					},
					{
						type: "text",
						props: {
							label: "Outras Complicações",
							name: "otherComplications",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Internamentos Anteriores",
							name: "previousHospitalizations",
							placeholder: "Descreva"
						}
					},
					{
						type: "text",
						props: {
							label: "Motivo",
							name: "reason",
							placeholder: "Descreva"
						}
					},
					{
						type: "date",
						props: {
							label: "Data",
							name: "date",
						}
					},
					{
						type: "text",
						props: {
							label: "Alergias",
							name: "allergies",
							placeholder: "Descreva"
						}
					},											
					{
						type: "text",
						props: {
							label: "Agente reativo",
							name: "reactiveAgent",
							placeholder: "Descreva"
						}
					},
				]
			}
		]
	}
}

function familyHistoryCardioPulmunaryComponent(){
  return {
		title: "Antecedentes Familiares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
        separatedElements: [
					{
						label:"Doênças na família",
						elements: [
							{
								type:"checkbox",
								props:{
									label: "infarto:",
									name: "heartAttack"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Hipertensão:",
									name: "hypertension"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Insuficiência Cardíaca:",
									name: "heartFailure"
								}
							},
							{
								type:"checkbox",
								props:{
									label: "Câncer do pulmão:",
									name: "lungCancer"
								}
							},
						]
					}
				], elements: []
			},
			{
				className: "w-96",
				elements: [
					{
						type: "text",
						props: {
							label: "Outras",
							name: "otherDisease",
							placeholder: "Descreva",
						}
					}
				]
			}
		]
	}
}

function lifeStyleHabitsComponent(){
  return {
		title: "Hábitos de Vida",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-3 items-center gap-x-2",
				elements: [
					{
						type: "text",
						props: {
							label: "Tabagismo",
							name: "smoking",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tempo de uso",
							name: "timeOfUse",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tentativas de cessação",
							name: "cessation",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Consumo de bebidas alcoólicas",
							name: "alcoholConsumption",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tipo de bebida",
							name: "typeOfDrink",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Frenquência",
							name: "frequency",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Actividade física",
							name: "physicalActivity",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tipos",
							name: "types",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Duração",
							name: "duration",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Regime Alimentar",
							name: "diet",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Comida habitual",
							name: "usualFood",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Nª de refeições dia",
							name: "numberOfMeals",
							placeholder: "Descreva",
						}
					},
				]
			}
		]
	}
}

function treatmentAndCareComponent(){
  return {
		title: "Plano de Tratamento e Cuidados",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Plano de Tratamento e Cuidados",
							name: "treatmentAndCare",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			}
		]
	}
}

function treatmentAndCareObjectiveComponent(){
  return {
		title: "Objectivos do Plano de Tratamento e Cuidados",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Objectivos do Plano de Tratamento e Cuidados",
							name: "TreatmentAndCareObjective",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			}
		]
	}
}

function diseaseinOphthalmologyComponent(){
  return {
		title: "História da Doênça Actual(Sinais e sintomas presentes)",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Dor",
							name: "pain",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Vermelhidão",
							name: "redness",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Lacrimejamento",
							name: "tearing",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Fotofobia",
							name: "photophobia",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Secreção",
							name: "secretion",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "checkbox",
						props: {
							label: "Visão Embaçada",
							name: "blurredVision",
						}
					},
				]
			},
			{
				className: "grid grid-cols-2 gap-x-4",
				elements: [
					{
						type: "text",
						props: {
							label: "Outros",
							name: "others",
							placeholder: "Descreva",

						}
					},
					{
						type: "text",
						props: {
							label: "Progressão dos Sinais e Sintomas",
							name: "progressionOfSymptoms",
							placeholder: "Descrever tratamentos feitos para as queixas",
							
						}
					},
				]
			},
		]
	}
}

function eyeExamsComponent(){
	return{
		title: "Exames Físicos Oculares",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-2 items-center gap-x-4",
				elements: [
					{
						type: "text",
						props: {
							label: "Acuidade Visual (OD, OE, CC, SC)",
							name: "visualAcuity",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tonometria",
							name: "tonometry",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Motilidade Ocular",
							name: "ocularMotility",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Reflexos Pupilares",
							name: "popullaryReflexes",
							placeholder: "Descreva",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Biomicroscopia",
							name: "biomicroscopy",
							rows: 3,
							placeholder: "pálpebras, conjuntiva, cómea, câmara anterior, íris, cristalino",
						}
					}
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Fundoscopia",
							name: "fundoscopy",
							rows: 3,
							placeholder: "papila ótica, retina, mácula, vasos",
						}
					}
				]
			}
		]
	}
}

function personalHistoryOphthalmologyComponent(){
  return {
		title: "Antecedentes Pessoais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
    		elements: [
					{
						type: "textarea",
						props: {
							label: "Doênças Sistêmicas",
							name: "systemicDiseases",
							rows: 3,
							placeholder: "diabetes, hipertensão, doênças autoimunes, outras",
						}
					}
				]
			},
			{
    		elements: [
					{
						type: "textarea",
						props: {
							label: "Doênças Oculares Prévias",
							name: "eyeDiseases",
							rows: 3,
							placeholder: "glaucoma, catarata, deslocamento de retina, outra",
						}
					}
				]
			},
			{ 
				className: "grid grid-cols-3 items-center gap-x-2",
				elements: [
					{
						type: "text",
						props: {
							label: "Cirurgias Oculares Prévias",
							name: "eyeSurgeries",
							placeholder: "Descreva"
						}
					},
					{
						type: "date",
						props: {
							label: "Data",
							name: "date",
						}
					},
					{
						type: "text",
						props: {
							label: "Uso de Óculos ou Lentes de Contato",
							name: "birthHeight",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tipo de Correção",
							name: "typeOfCorrection",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tempo de Uso",
							name: "timeOfUse",
							placeholder: "Descreva"
						}
					},
					{
						type: "text",
						props: {
							label: "Resultados Obtidos",
							name: "resultsObtained",
							placeholder: "Descreva"
						}
					},
					{
						type: "text",
						props: {
							label: "Alergias Ocular",
							name: "eyeAllergies",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Agente Reativo",
							name: "reactiveAgent",
							placeholder: "Descreva"
						}
					},											
					{
						type: "text",
						props: {
							label: "Outros",
							name: "others",
							placeholder: "Descreva"
						}
					},
				]
			}
		]
	}
}

function familyHistoryOphthalmologyComponent(){
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
							label: "Doênças Oculares na Família",
							name: "eyesDiseases",
							rows: 3,
							placeholder: "glaucoma, degeneração, macular, retinite pigmentosa, outras",
						}
					}
				]
			},
			{
    		elements: [
					{
						type: "textarea",
						props: {
							label: "Doênças Sistêmicas na Família",
							name: "systemicDiseases",
							rows: 3,
							placeholder: "diabetes, hipertensão, doênças autoimunes, outras",
						}
					}
				]
			},
		]
	}
}

function socialHistoryComponent(){
	return{
		title: "História Social",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				separatedElements: [
					{ 
						className: "flex gap-x-2 items-center",
						label: "Hábitos de vida",
						elements: [
							{
								type: "checkbox",
								props: {
									label: "Tabagismo",
									name: "smoking"
								}
							},
							{
								type: "checkbox",
								props: {
									label: "Estilismo",
									name: "style"
								}
							},
							{
								type: "checkbox",
								props: {
									label: "Drogas",
									name: "drugs"
								}
							}
						]
					}
			  ], elements: []
			},
			{
				className: "grid grid-cols-2 gap-x-4",
				elements: [
					{
						type: "text",
						props: {
							label: "Exposição Ocupacional a Riscos Oculares",
							name: "eyeRisks",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Actividades de Lazer que possam Afectar a Visão",
							name: "leisureActivities",
							placeholder: "Descreva",
						}
					}
				]
			},
		]
	}
}

function systemsReviewComponent(){
  return {
		title: "Revisão de Sistemas",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sintomas Gerais",
							name: "generalSymptoms",
							rows: 3,
							placeholder: "febre, perda de peso, outro",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sintomas Neurológicos",
							name: "neurologicalSymptoms",
							rows: 3,
							placeholder: "cefaleia, tontura, outro",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sintomas Cardiovasculares",
							name: "cardiovascularSymptoms",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sintomas Respiratórios",
							name: "respiratorySymptoms",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sistomas Gastrointestinais",
							name: "gastrointestinalSymptoms",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
		]
	}
}

function therapyAndCareComponent(){
  return {
		title: "Plano Terapêutico e de Cuidados",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Plano Terapêutico e de Cuidados",
							name: "therapyAndCare",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			}
		]
	}
}

function therapyAndCareobjectiveComponent(){
  return {
		title: "Objectivos do Plano Terapêutico e dos Cuidados",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Objectivos do Plano Terapêutico e dos Cuidados",
							name: "therapyAndCareObjective",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			}
		]
	}
}

function diseasesPediatricComponent(){
  return {
		title: "História da Doênça Actual(Sinais e sintomas presentes)",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Sinais e Sintomas(início, duração, evolução, intensidade, outros aspectos associados aos sinais e sintomas)",
							name: "symptoms",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Tratamento Prévio(descrever tratamento feitos para as queixas actuais, e resultados)",
							name: "previousTreatment",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
		]
	}
}

function examAndEvaluationComponent(){
  return {
		title: "Exame Físico e Avialação dos Orgãos Vitais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Exame Físico e Avialação dos Orgãos Vitais",
							name: "examAndEvaluation",
							rows: 3,
							placeholder: "Descreva",
						}
					},
				]
			},
		]
	}
}

function personalHistoryPediatricComponent(){
  return {
		title: "Antecedentes Pessoais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				separatedElements: [
					{ 
						className: "flex gap-x-2 items-center",
						label: "Tipo de parto",
						elements: [
							{
								type: "radio",
								props: {
									label: "Normal",
									name: "typeOfDelivery"
								}
							},
							{
								type: "radio",
								props: {
									label: "Cesariana",
									name: "typeOfDelivery"
								}
							},
						]

					}
				], elements: []
			},
			{
				className: "grid grid-cols-3 gap-x-2",
				elements: [
					{
						type: "number",
						props: {
							label: "Idade gestacional",
							name: "gestationalAge",
							placeholder: "Digite o valor"
						}
					},
					{
						type: "number",
						props: {
							label: "Peso ao nascer(kg)",
							name: "birthWeight",
							placeholder: "Digite o valor"
						}
					},
					{
						type: "number",
						props: {
							label: "Altura ao nascer(kg)",
							name: "birthHeight",
							placeholder: "Digite o valor"
						}
					},
				]
			},
			{
				elements: [
					{
						type: "textarea",
						props: {
							label: "Desenvolvimento Neuropsicomotor",
							name: "neuropsychomotorDevelopment",
							placeholder: "descrever aspectos relevantes sobre o desenvolvimento da criança",
						}
					}
				]
			}
		]
	}
}

function foodInPediatricComponent(){
  return {
		title: "Antecedentes Pessoais",
		apiFn: signUrgencyBank,
		initialState: { message: "", status: false },
		childrens: [
			{
				separatedElements: [
					{ 
						className: "flex gap-x-2 items-center",
						label: "Aleitamento materno",
						elements: [
							{
								type: "radio",
								props: {
									label: "Sim",
									name: "breastfeeding",
								}
							},
							{
								type: "radio",
								props: {
									label: "Não",
									name: "breastfeeding",
								}
							},
						]
					}
				], elements: []
			},
			{
				elements: [
					{
						type: "text",
						props: {
							label: "Razões",
							name: "reason",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Alimentação Complementar",
							name: "complementaryFeeding",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Tipo",
							name: "type",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Inicio da Alimentação Complementar",
							name: "startOfComplementaryFeeding",
							placeholder: "Descreva",
						}
					},
					{
						type: "text",
						props: {
							label: "Resultados Visíveis",
							name: "visibleResults",
							placeholder: "Descreva",
						}
					},
				]
			},
		]
	}
}

export {
  personalInternalComponent,
	symptomsInternalComponent,
	diseaseInGeneralClinicComponent,
  examsInternalComponent,
	diagnosticInternalComponent,
	diseasesInternalComponent,
	othersInternalComponent,
	evaluationInternalComponent,
	lifeStyleInternalComponent,
	eatingHabitsInternalComponent,
	familyInternalComponent,
	gestationComponent,
	symptomsComponent,
	prenatalExamsComponent,
	diseaseCardioPulmunaryComponent,
	phisicalExamComponent,
	personalHistoryCardioPulmunaryComponent,
	familyHistoryCardioPulmunaryComponent,
	lifeStyleHabitsComponent,
	treatmentAndCareComponent,
	treatmentAndCareObjectiveComponent,
	diseaseinOphthalmologyComponent,
	eyeExamsComponent,
	personalHistoryOphthalmologyComponent,
	familyHistoryOphthalmologyComponent,
	socialHistoryComponent,
	systemsReviewComponent,
	therapyAndCareComponent,
	therapyAndCareobjectiveComponent,
  diseasesPediatricComponent,
	examAndEvaluationComponent,
	personalHistoryPediatricComponent,
	foodInPediatricComponent,
}