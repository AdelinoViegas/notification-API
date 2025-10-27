import { SelectionOption } from "@/components/ui/selection";

export const AngolaProvices: SelectionOption [] = [
  { _id: "bengo", label: "Bengo" },
  { _id: "benguela", label: "Benguela" },
  { _id: "bie", label: "Bié" },
  { _id: "cabinda", label: "Cabinda" },
  { _id: "cuando", label: "Cuando" },
  { _id: "cubango", label: "Cubango" },
  { _id: "cuanza-norte", label: "Cuanza Norte" },
  { _id: "cuanza-sul", label: "Cuanza Sul" },
  { _id: "cunene", label: "Cunene" },
  { _id: "huambo", label: "Huambo" },
  { _id: "huila", label: "Huíla" },
  { _id: "icolo-e-bengo", label: "Icolo e Bengo" },
  { _id: "luanda", label: "Luanda" },
  { _id: "lunda-norte", label: "Lunda Norte" },
  { _id: "lunda-sul", label: "Lunda Sul" },
  { _id: "malanje", label: "Malanje" },
  { _id: "moxico", label: "Moxico" },
  { _id: "moxico-leste", label: "Moxico Leste" },
  { _id: "namibe", label: "Namibe" },
  { _id: "uige", label: "Uíge" },
  { _id: "zaire", label: "Zaire" },
];

const patientGroup:SelectionOption[] = [
  {
    _id:'personal',
    label:"Particular",
  },
  {
    _id:'enterprise',
    label:"Empresa",
  },
  {
    _id:'assured',
    label:"Assegurado",
  },  
  {
    _id:'employee',
    label:"Funcionário",
  }
]

const civilState:SelectionOption[] = [
  {
   _id:'single',
   label:'Solteiro/a',
  },
  {
    _id:'married',
    label:'Casado/a', 
  },
  {
    _id:"widower",
    label:"Viúvo/a",
  },
  {
    _id:"divorced",
    label:"Divorciado/a",
  }
];

const gender:SelectionOption[] = [
  {
   _id:'masculine',
   label:'Maculino',
  },
  {
    _id:'feminine',
    label:'Feminino', 
  },
];

const emergencyService:SelectionOption[] = [
  {
   _id:'masculine',
   label:'Pediatria',
  },
  {
    _id:'feminine',
    label:'Medica', 
  },
  {
    _id: "test",
    label: "Cirurgia"
  }
];

const kinshipDegree:SelectionOption[] = [
	{
		_id:"father",
		label:"Pai",
	},
	{
		_id:"mather",
		label:"Mãe",
	},
	{
		_id:"uncle",
		label:"Tio/a",
	},
	{
		_id:"counsin",
		label:"Primo/a",
	},
  {
		_id:"brother/sister",
		label:"Irmão/ã",
	},
  {
    _id:"nephew/niece",
    label:"Sobrinho/a"
  },
	{
		_id:"grandFather",
		label:"Avô",
	},
	{
		_id:"grandMather",
		label:"Avó",
	},
  {
    _id:"others",
    label:"Outros",
  }
];

const patientAccess:SelectionOption[] = [
  {
    _id:'direct',
    label:"Directo",
  },
  {
    _id:'transferred',
    label:"Transferido(a)",
  },
]

const hospitalUnit:SelectionOption[] = [
  {
    _id:'HJM',
    label:"Hospital Josina Machel",
  },
  {
    _id:'HAB',
    label:"Hospital Américo Boavida",
  },
  {
    _id:'HGL',
    label:"Hospital Geral de Luanda",
  },
  {
    _id:'HPD',
    label:"Hospital Pediátrico David Bernardino",
  },
  {
    _id:'CSE',
    label:"Clínica Sagrada Esperança",
  },
  {
    _id:'CM',
    label:"Clínica Multiperfil",
  },
];

const priorityToComponent:SelectionOption[] = [
  { 
    _id: "red", 
    label: "Emergência",
  },
  { 
    _id: "orange", 
    label: "Muito Urgente",
  },
  { 
    _id: "yellow", 
    label: "Urgente",
  },
  { 
    _id: "green", 
    label: "Pouco urgente",
  },
  { 
    _id: "blue", 
    label: "Não urgente",
  },
];

const priority = [
  { 
    _id: "blue", 
    label: "Não urgente",
    urgency: "no",
    time: 240, // in minutes,
    color: "#0090d7",
    description: "Pode aguardar atendimento ou ser encaminhado para outros serviços"
  },
  { 
    _id: "green", 
    label: "Pouco urgente",
    urgency: "little",
    time: 120, // in minutes,
    color: "#28b172",
    description: "Pode aguardar atendimento ou ser encaminhado para outros serviços"
  },
  { 
    _id: "yellow", 
    label: "Urgente",
    urgency: "yes",
    time: 60, // in minutes,
    color: "#ffd900",
    description: "Precisa de atendimento rápido mas pode aguardar"
  },
  { 
    _id: "orange", 
    label: "Muito Urgente",
    urgency: "very",
    time: 10, // in minutes,
    color: "#f8931f",
    description: "Precisa de rápido atendimento"
  },
  { 
    _id: "red", 
    label: "Emergência",
    urgency: "high",
    time: 0, // in minutes,
    color: "#bf2821",
    description: "Precisa de atendimento imediato"
  },
];

const urgencyServices: SelectionOption[] = [
  { 
    _id: "paediatrics", 
    label: "Pediatria"
  },
  {
    _id: "surgery",
    label: "Cirurgia"
  },
  {
    _id: "medicine",
    label: "Medicina"
  }
]; // isto é tbm os officeId

const userCategory = [
  {
    _id: "doctor",
    label: "Médico"
  },
  {
    _id: "nurse",
    label: "Enfermeiro"
  },
  {
    _id: "others",
    label: "Outros"
  },
];

const unitTypes = [
  {
    _id: "workplace",
    label: "Area de trabalho"
  },
  {
    _id: "internment",
    label: "Area de Internamento"
  },
  {
    _id: "laboratory",
    label: "Laboratório"
  },
  {
    _id: "imaging",
    label: "Imagiologia"
  },
];

const ccgTypes = {
  category: {
    single: "Categoria",
    plural: "Categorias"
  },
  classification: {
    single: "Classificação",
    plural: "Classificações"
  },
  group: {
    single: "Grupo",
    plural: "Grupos"
  }
};

const surgerySchedulingArea = [
  {
    _id: "urgency-bank",
    label: "Consultório de urgência",
    color: "red",
  },
  {
    _id: "hospitalization",
    label: "Internamento",
    color: "orange",
  },
  {
    _id: "office",
    label: "Consultório",
    color: "yellow",
  },
  {
    _id: "patient",
    label: "Utentes",
    color: "green",
  },
];

const defaultServiceKinds = [
  { _id: "exam", label: "Exame" },
  { _id: "consultation", label: "Consulta" },
  { _id: "surgery", label: "Cirurgia" },
];

export { 
  patientGroup,
  civilState,
  gender,
  kinshipDegree,
  patientAccess,
  hospitalUnit,
  emergencyService,
  priority,
  priorityToComponent,
  urgencyServices,
  userCategory,
  unitTypes,
  ccgTypes,
  surgerySchedulingArea,
  defaultServiceKinds
};